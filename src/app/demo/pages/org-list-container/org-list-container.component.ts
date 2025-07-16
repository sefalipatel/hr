import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgListPresentationComponent } from './org-list-presentation/org-list-presentation.component';
import { Organization, ToastType } from '../../models/models';
import { CommonService } from 'src/app/service/common/common.service';
@Component({
  selector: 'app-org-list-container',
  standalone: true,
  imports: [CommonModule, OrgListPresentationComponent],
  templateUrl: './org-list-container.component.html',
  styleUrls: ['./org-list-container.component.scss']
})
export class OrgListContainerComponent implements OnInit {

  organizationList: Organization[] = [];
  loading: boolean = false;

  constructor(private _commonService: CommonService) {
    this.organizationList = [];
  }

  ngOnInit(): void {
    this.getAllOrganizations();
  }

  getAllOrganizations() {
    this.loading = true;
    this._commonService.get(`Organizations`).subscribe((res: Organization[]) => {
      this.organizationList = res;
      this.loading = false;

      this.organizationList = res?.map((x: any) => {
        x.imageLogo = x.imageLogo && x.imageLogo.includes('.') ? x.imageLogo?.split('Images\\OrganizationImages\\')?.length - 1 > 1 ? x.imageLogo.replace('\\Images\\OrganizationImages', '') : x.imageLogo : '';
        x.favIcon = x.favIcon && x.favIcon.includes('.') ? x.favIcon?.split('Images\\OrganizationImages\\')?.length - 1 > 1 ? x.favIcon.replace('\\Images\\OrganizationImages', '') : x.favIcon : '';
        x.logo = x.logo && x.logo.includes('.') ? x.logo?.split('Images\\OrganizationImages\\')?.length - 1 > 1 ? x.logo.replace('\\Images\\OrganizationImages', '') : x.logo : '';
        return x;
      }
      );
    }, (err) => {
      this.loading = false;
    })
  }

  async deleteOrganization(id: string | any) {
    if (id) {
      this.loading = true;
      this._commonService.delete(`Organizations/${id}`).subscribe((res) => {
        this.loading = false;

        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Organization deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllOrganizations();
        }
        if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      })
    }
  }

  updateStatus(data: any) {
    this.loading = true;
    this._commonService.post(`Organizations/${data?.id}/active/${data?.status}`, '').subscribe(res => {
      this.loading = false;
      this.getAllOrganizations();
    },
      (error) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      })
  }
}
