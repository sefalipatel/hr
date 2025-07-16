import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
import { ConfigType, data } from './smssetting.model';
import { DynamicKeys, ToastType } from 'src/app/service/common/common.model';
import { MatSelectModule } from '@angular/material/select';
import { userRole } from 'src/app/assets.model';

@Component({
  selector: 'app-sms-setting',
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.scss']
})
export class SmsSettingComponent {
  password = 'password'
  show = false;
  public selectedEmailConfig = ''
  public smsSettingForm: FormGroup;
  public configDetailForm: FormGroup;
  public dynamicKeys: Array<DynamicKeys> = [];
  public userRole: Array<userRole> = [];
  isSubmitting : boolean = false

  // apiRoutes = apiRoutes;
  public configKeys: Array<DynamicKeys> = [
    { label: "Twillio Account Sid", control: "twillioAccountSid" },
    { label: "Twillio Authtoken", control: "twillioAuthtoken" },
    { label: "Twillio From Name", control: "twillioFromName" },
  ];
  smsConfigList: data[] = [
    { value: 'Twilio', type: ConfigType.TWILIO },
  ];

  constructor(private _formBuilder: FormBuilder, private _httpService: CommonService) {
    this.smsSettingForm = this.buildForm();
    this.configDetailForm = this._formBuilder.group({})
  }

  ngOnInit(): void {
    this.getSmsSetting();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "SMSSettings";
      })
    }
  }

  get ef() {
    return this.smsSettingForm.controls;
  }
  get cf() {
    return this.configDetailForm.controls;
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  public onConfigChange(value: any, data: any = null) {
    switch (value) {
      case ConfigType.TWILIO:
        this.configDetailForm = this._formBuilder.group({
          twillioAccountSid: ['', [Validators.required]],
          twillioAuthtoken: ['', [Validators.required]],
          twillioFromName: ['', [Validators.required]]
        })
        break;

      default:
        this.configDetailForm = this._formBuilder.group({})
        break;
    }
    this.dynamicKeys = this.configKeys.filter(x => Object.keys(this.configDetailForm.value)?.includes(x.control));

    if (data) {
      this.configDetailForm.patchValue(data)
    }
  }

  public saveConfig() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.smsSettingForm.invalid || this.configDetailForm.invalid) {
      this.smsSettingForm.markAllAsTouched();
      this.configDetailForm.markAllAsTouched();
      return;
    }
    // Request: FormData
    let formData = new FormData();
    let emailKeys = Object.keys(this.smsSettingForm.value);
    let configKeys = Object.keys(this.configDetailForm.value);
    emailKeys?.forEach(k => {
      formData.append(k, this.smsSettingForm.value[k])
    });
    configKeys?.forEach(k => {
      formData.append(k, this.configDetailForm.value[k])
    });
    formData.append('OrganizationId', localStorage.getItem('orgId') ?? '')
    // // Request: JSON
    // let payload = {
    //   ...this.emailSettingForm.value,
    //   ...this.configDetailForm.value,
    //   "OrganizationId": localStorage.getItem('orgId')
    // }
    this._httpService.post('SMSSetting', formData).subscribe((res) => {
      if (res?.id) {
        this._httpService.showToast('Email setting saved successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
        this.isSubmitting = false
      }
    }, (err) => {

    })
  }

  public getSmsSetting() {
    let orgId = localStorage.getItem('orgId')
    this._httpService.get('SMSSetting' + `/SMSSettingByOrgId?organizationId=${orgId}`).subscribe((res) => {
      if (res?.statusCode == 200) {
        this.smsSettingForm.patchValue({ mailType: ConfigType.TWILIO });
        this.onConfigChange(ConfigType.TWILIO, res?.value);
      } else {
        this._httpService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
    })
  }

  private buildForm(): FormGroup {
    return this._formBuilder.group({
      mailType: [, [Validators.required]]
    })
  }
}
