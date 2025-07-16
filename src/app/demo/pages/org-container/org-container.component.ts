import { Component, Input, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { OrgPresentationComponent } from './org-presentation/org-presentation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Organization, ToastType } from '../../models/models';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-org-container',
  standalone: true,
  imports: [CommonModule, OrgPresentationComponent],
  templateUrl: './org-container.component.html',
  styleUrls: ['./org-container.component.scss']
})

export class OrgContainerComponent {
  colorchnage: any
  public orgData!: Organization;
  public refresh: boolean = false;
  loading: boolean = false;
  @Input() isSettings: boolean = false;
  public id: string = "";
  @Input() public set orgId(id: string) {
    this._orgId = id;
    if (id) {
      this.getOrganizationSetting(id);
    }
  }

  public get orgId(): string {
    return this._orgId;
  }

  private _orgId!: string;

  constructor(private _commonService: CommonService, private _router: Router, private route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private title: Title) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id) {
      this.isSettings = false;
      this.getOrganizationSetting(this.id);
    }
  }

  public saveOrganizationSetting(formData: FormData) {
    if (this.orgId || this.id) {
      formData.append("id", this.orgId ?? this.id)
      this.updateOrganization(formData)
    } else {
      this.addOrganization(formData)
    }
  }

  addOrganization(formData: FormData) {
    this.refresh = false;
    this.loading = true;
    this._commonService.post(`Organizations`, formData).subscribe((res: Organization | any) => {
      if (res?.statusCode == 200) {
        this.refresh = true;
        this.loading = false;
        this._commonService.showToast('Organization Saved Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSettings ? this.getOrganizationSetting(res?.value?.id) : this._router.navigate(['/organization-details']);
      } else {
        this.loading = false;
        this._commonService.showToast(res['errors'][0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this.loading = false;
      this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
    })
  }

  updateOrganization(formData: FormData) {
    this.refresh = false;
    this.loading = true;
    formData.append('primaryColorCode', this.colorchnage);
    this._commonService.put(`Organizations`, formData).subscribe((res: Organization | any) => {
      if (res?.statusCode == 200) {
        this.refresh = true;
        this.loading = false;
        this._commonService.showToast(this.isSettings ? 'Organization Setting Saved Successfully!' : 'Organization Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS)
        this.isSettings ? this.getOrganizationSetting(res?.value?.id) : this._router.navigate(['/organization-details']);
      } else {
        this.loading = false;
        this._commonService.showToast(res['errors'][0]?.errorMessage, ToastType.ERROR, ToastType.ERROR);
      }
    }, (err) => {
      this.loading = false;
      this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
    })
  }

  public getOrganizationSetting(id: string) {
    this.loading = true;
    this._commonService.get(`Organizations/${id}`).subscribe((res: Organization | any) => {
      this.loading = false;
      if (res?.value) {
        res.value.logo = res?.value?.logo && res?.value?.logo.includes('.') ? res?.value?.logo?.split('Images\\OrganizationImages\\')?.length - 1 > 1 ? res?.value?.logo.replace('\\Images\\OrganizationImages', '') : res?.value?.logo : ''
        res.value.favicon = res?.value?.favicon && res?.value?.favicon.includes('.') ? res?.value?.favicon?.split('Images\\OrganizationImages\\')?.length - 1 > 1 ? res?.value?.favicon.replace('\\Images\\OrganizationImages', '') : res?.value?.favicon : ''
        this.orgData = res?.value;
        if (this.isSettings) {
          localStorage.setItem('orgId', res?.value?.id);
          let logo = res?.value?.logo;
          let primaryColor = res?.value?.primaryColorCode;
          let title = res?.value?.title;
          let favIcon = res?.value?.favicon;
          if (logo && logo?.includes('.')) {
            localStorage.setItem('orgLogo', `${environment.apiUrl.replace('api/', '')} ` + (logo?.match('\\Images\\OrganizationImages')?.length > 1 ? logo.replace('\\Images\\OrganizationImages', '') : logo))
          }
          if (primaryColor) {
            localStorage.setItem('primaryColor', primaryColor);
            document.documentElement.style.setProperty('--dynamic-colour', primaryColor)
          }
          if (favIcon && favIcon?.includes('.')) {
            let icon = `` + (favIcon?.match('\\Images\\OrganizationImages')?.length > 1 ? favIcon.replace('\\Images\\OrganizationImages', '') : favIcon)
            localStorage.setItem('favIcon', icon);
            this._document?.getElementById('appFavicon')?.setAttribute('href', icon);
          }
          if (title) {
            localStorage.setItem('title', title);
            this.title.setTitle(title);
          }
        }
      }
    }, (err) => {
      this.loading = false;
      this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
    })
  }

}
