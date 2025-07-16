import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigType, data } from './emailsetting.model';
import { DynamicKeys, EmailSetting, ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
@Component({
  selector: 'app-email-setting',
  standalone: true,
  imports: [CommonModule, SharedModule, MatSelectModule],
  templateUrl: './email-setting.component.html',
  styleUrls: ['./email-setting.component.scss']
})
export class EmailSettingComponent {
  password = 'password'
  show = false;
  public selectedEmailConfig = ''
  public emailSettingForm: FormGroup;
  public configDetailForm: FormGroup;
  public isMailAdd: boolean = false;
  isSubmitting : boolean = false;
  public mailId = '';
  public sortConfig!: Sort;
  public tableData: Array<EmailSetting> = [];
  public emailConfigId: string = "";
  public mailIndex: number;
  loading : boolean = false;
  public dynamicKeys: Array<DynamicKeys> = [];
  public userRole: Array<userRole> = [];
  public configKeys: Array<DynamicKeys> = [
    { label: "SMTP From Email", control: "smtpFromEmail" },
    { label: "SMTP Password", control: "smtpPassword" },
    { label: "SMTP From Name", control: "smtpFromName" },

    { label: "SendGrid API Key", control: "sendGridAPIKey" },
    { label: "SendGrid Sender Email", control: "sendGridSenderEmail" },
    { label: "SendGrid Name", control: "sendGridName" },

    { label: "Zepto Bounce Address", control: "zeptoBounceAddress" },
    { label: "Zepto API Key", control: "zeptoAPIKey" },
    { label: "Zepto From Email", control: "zeptoFromEmail" },
    { label: "Zepto From Name", control: "zeptoFromName" },
    { label: "Zepto SMTP Email API", control: "zeptoSMTPEmailAPI" },
  ];
  emailConfigList: data[] = [
    { value: 'SMTP', type: ConfigType.SMTP },
    { value: 'Send Grid', type: ConfigType.SENDGRID },
    { value: 'Zepto', type: ConfigType.ZEPTO }, 
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;

  constructor(private _formBuilder: FormBuilder,
    private _httpService: CommonService,
    private activateRoute: ActivatedRoute,
    private sweetlalert: SweetalertService) {
    this.emailSettingForm = this.buildForm();
    this.configDetailForm = this._formBuilder.group({})
  }

  ngOnInit(): void {
    this.getAllEmailSetting();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));

    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "EmailSettings";
      })
    }
  }

  get ef() {
    return this.emailSettingForm.controls;
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
      case ConfigType.SMTP:
        this.configDetailForm = this._formBuilder.group({
          smtpFromEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
          smtpPassword: ['', [Validators.required]],
          smtpFromName: ['', [Validators.required]]
        })
        break;
      case ConfigType.SENDGRID:
        this.configDetailForm = this._formBuilder.group({
          sendGridAPIKey: ['', [Validators.required]],
          sendGridSenderEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
          sendGridName: ['', [Validators.required]]
        })
        break;
      case ConfigType.ZEPTO:
        this.configDetailForm = this._formBuilder.group({
          zeptoBounceAddress: ['', [Validators.required]],
          zeptoAPIKey: ['', [Validators.required]],
          zeptoFromEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
          zeptoFromName: ['', [Validators.required]],
          zeptoSMTPEmailAPI: ['', [Validators.required]],
        })
        break;

      default:
        this.configDetailForm = this._formBuilder.group({})
        break;
    }
    this.dynamicKeys = this.configKeys.filter(x => Object.keys(this.configDetailForm.value)?.includes(x.control));
  }

  public saveConfig() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.emailSettingForm.invalid || this.configDetailForm.invalid) {
      this.emailSettingForm.markAllAsTouched();
      this.configDetailForm.markAllAsTouched();
      return;
    }
    // Request: FormData
    let formData = new FormData();
    let emailKeys = Object.keys(this.emailSettingForm.value);
    let configKeys = Object.keys(this.configDetailForm.value);
    emailKeys?.forEach(k => {
      formData.append(k, this.emailSettingForm.value[k])
    });
    configKeys?.forEach(k => {
      formData.append(k, this.configDetailForm.value[k])
    });
    formData.append('isDefault', this.emailSettingForm.value?.isDefault)
    formData.append('OrganizationId', localStorage.getItem('orgId') ?? '')
    if (this.emailConfigId) {
      let formDataObject = {
        id: this.emailConfigId,
        ...formData
      };

      // Convert the plain object to FormData
      for (let key in formDataObject) {
        formData.append(key, formDataObject[key]);
      }
      this._httpService.put('EmailSetting', formData).subscribe(res => {
        if (res) {
          this._httpService.showToast('Email setting updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false 
          this.tableData[this.mailIndex] = res;
        } else {
          this._httpService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      })
    } else {
      this._httpService.post('EmailSetting', formData).subscribe((res) => {
        if (res?.statusCode === 200) {
          this._httpService.showToast('Email setting saved successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.getAllEmailSetting();
        } else{
          this._httpService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._httpService.showToast("Something went wrong.", ToastType.ERROR, ToastType.ERROR)

      })
    }
  }

  trimInput(controlName: string) {
   const control = this.configDetailForm.get(controlName);
    if (control && control.value) {
      control.setValue(control.value.trim())
    }
  }

  public getAllEmailSetting() {
    this.loading = true
    let orgId = localStorage.getItem('orgId');
    this._httpService.get(`EmailSetting/EmailSettingByOrgId?organizationId=${orgId}`).subscribe((res) => {
      this.loading = false
      this.tableData = res.value;
      if (res?.statusCode == 200) {
        this.onConfigChange(res?.value?.mailType, res?.value);
      } else {
        this._httpService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
    })
  }

  private buildForm(): FormGroup {
    return this._formBuilder.group({
      mailType: ['', [Validators.required]],
      isDefault: [true]
    })
  }

  // Open email form on add email click
  addEmail() {
    this.isMailAdd = true;
    this.mailId = ''
  }

  // close form
  closeFrom() {
    this.emailSettingForm.reset();
    this.isMailAdd = false;
    this.mailId = ''
  }

  public sortData(sort: Sort | any) {
    this.sortConfig = sort;
    return;
  }

  // All fill data has been checked before submit
  testConnection() {
    let res = {
      ...this.configDetailForm.value,
      ...this.emailSettingForm.value
    };
    let payload: any = {
      mailType: res?.mailType
    };
    if (res?.mailType == "SMTP") {
      payload = {
        ...payload,
        smtpFromEmail: res.smtpFromEmail,
        smtpFromName: res.smtpFromName,
        smtpPassword: res.smtpPassword
      }
    } else if (res?.mailType == "SendGrid") {
      payload = {
        ...payload,
        sendGridAPIKey: res.sendGridAPIKey,
        sendGridName: res.sendGridName,
        sendGridSenderEmail: res.sendGridSenderEmail
      }
    } else if (res?.mailType == "Zepto") {
      payload = {
        ...payload,
        zeptoAPIKey: res.zeptoAPIKey,
        zeptoBounceAddress: res.zeptoBounceAddress,
        zeptoFromEmail: res.zeptoFromEmail,
        zeptoFromName: res.zeptoFromName,
        zeptoSMTPEmailAPI: res.zeptoSMTPEmailAPI
      }
    }
    this._httpService.post('EmailSetting/testConnection', payload).subscribe(res => {
      if (res?.value) {
        this._httpService.showToast('Test successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      }
    })
  }

  // Edit Email
  editRole(id: string | any, i) {
    this.isMailAdd = false;
    this.mailId = id;
    this.getEmailById(id);
    this.mailIndex = i;
  }

  // Delete email
  async deleteBtn(id: string | any) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._httpService.delete('EmailSetting' + `/${id}`).subscribe(res => {
        if (res?.statusCode == 200) {
          if (res?.value?.isDefault == true) {
            this._httpService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
          } else {
            this._httpService.showToast("Email deleted successfully", ToastType.SUCCESS, ToastType.SUCCESS)
            this.getAllEmailSetting();
          }
        }
        if (res?.statusCode == 400) {
          this._httpService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (error) => {
        this._httpService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  // Get perticular email Id
  getEmailById(id: string | any) {
    this._httpService.get('EmailSetting' + `/${id}`).subscribe(res => {
      this.emailConfigId = res?.value?.id;
      this.emailSettingForm.patchValue(res?.value);
      this.configDetailForm.patchValue(res?.value);
    })
  }

  // Chnage toggle switch action
  ChangeToggleSwitch(id: string) {
    const IsDefault = true;
    this._httpService.put(`EmailSetting/${id}/isDefault/${IsDefault}`, '').subscribe(res => {
      this.getAllEmailSetting();
    })
  }

}

