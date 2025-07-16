import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

export enum LoginType {
  Microsoft = 1,
  Google = 2,
  Custom = 3
}

export enum isCheck {
  false = 0,
  true = 1
}
@Component({
  selector: 'app-organization-authentication',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './organization-authentication.component.html',
  styleUrls: ['./organization-authentication.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationAuthenticationComponent implements OnInit {
  public organizationAuthForm: FormGroup;
  public getAuthList: any;
  public orgAuthId: any;
  public typeOfLogin = LoginType;
  public postOrganizationAuth: any
  public orgId: any;
  public isDisplay = isCheck;

  constructor(private commonService: CommonService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) {
    this.organizationAuthForm = this.buildForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.orgAuthId = this.orgAuthId ?? params['id']
    })
    this.getAllAuth();
  }

  buildForm() {
    return this.formBuilder.group({})
  }
getAllAuth() {
  this.commonService.get('OrganizationAuthentication').subscribe(res => {
    if (res.statusCode === 200) {
      this.getAuthList = res.value.map((x: any) => ({
        ...x,
        authenticationType: x.authenticationtype 
      }));

      this.getAuthList.forEach((x, i) => {
        this.organizationAuthForm.addControl(i, this.formBuilder.group({
          apiKey: [x.apiKey || ''],
          apiSecretKey: [x.apiSecretKey || '']
        }));
      });
    }
  });
} 

  submit() {
    let payload = this.getAuthList.map(x => {
      return {
        apiKey: x.apiKey,
        apiSecretKey: x.apiSecretKey,
        authenticationType: x.authenticationType,
        organizationId: this.orgId,
        isDisplay: x.isDisplay
      }
    });
    if (payload.length > 0) {
      this.commonService.post('OrganizationAuthentication', payload).subscribe(res => {
        if (res) {
          this.commonService.showToast('Organization authentication has been successfully updated', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      }, (err) => {
        this.commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  onList() {
    this.router.navigate(['organization-details']);
  }

  update(isDisplay: boolean, index: number) {
    this.getAuthList[index].isDisplay = isDisplay;
  }

}
