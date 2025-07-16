import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgPresenterService } from '../org-presenter/org-presenter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Organization, ToastType } from 'src/app/demo/models/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonService } from 'src/app/service/common/common.service';
import { ColorPickerModule } from 'primeng/colorpicker';
import { environment } from 'src/environments/environment';
import { userRole } from 'src/app/assets.model';
import { log } from 'console';
@Component({
  selector: 'app-org-presentation',
  standalone: true,
  imports: [CommonModule, SharedModule, ColorPickerModule, MatFormFieldModule, MatProgressSpinnerModule],
  templateUrl: './org-presentation.component.html',
  styleUrls: ['./org-presentation.component.scss'],
  viewProviders: [OrgPresenterService]
})
export class OrgPresentationComponent implements OnInit {
  public imageFileOnly: string;
  primaryColor: string;
  secondaryColor: string;
  uploadedlogo: string;
  defaultUploadedlogo: any;
  mainTitle: string;
  uploadedFavIcon: string;
  defaultUploadedFavIcon: any;
  orgForm: FormGroup;
  submitted: boolean;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  isTimer: boolean;
  isCaptured: boolean;
  is2FA: boolean;
  @Input() isSettings: boolean = false;
  name: string = '';

  @Input() refresh(value: boolean) {
    if (value) {
      this._orgPresenterService.updatePrimaryColor(this.orgForm.value.primaryColorCode);
      this._orgPresenterService.updateSecondaryColor(this.orgForm.value.secondaryColorCode);
      this._orgPresenterService.updateFavIcon(this.uploadedFavIcon);
      this._orgPresenterService.updateTitle(this.orgForm.value.title);
    }
  }

  @ViewChild('favIconUploader') favIconUploader!: ElementRef;
  @ViewChild('logoUploader') logoUploader!: ElementRef;
  @Output() saveOrganizationSetting: EventEmitter<FormData> = new EventEmitter<FormData>();
  @Input() public set orgData(data: Organization) {
    this._orgData = data;
    if (data) {
      data.primaryColorCode = data?.primaryColorCode?.trim();
      data.secondaryColorCode = data?.secondaryColorCode?.trim();
      this.orgForm.patchValue(data);
      this.orgForm.controls['code'].disable();
      this.primaryColor = this.orgForm.controls['primaryColorCode']?.value ?? '#000000';
      this.secondaryColor = this.orgForm.controls['secondaryColorCode']?.value ?? '#000000';
      let icon: string = data?.favicon && data?.favicon?.includes('.') ? `${environment.apiUrl.replace('api/', '')}` + data?.favicon : '';
      let logo = data?.logo && data?.logo?.includes('.') ? `${environment.apiUrl.replace('api/', '')}` + data?.logo : '';
      this.uploadedFavIcon = icon;
      this.defaultUploadedFavIcon = icon;
      this.uploadedlogo = logo;
      this.defaultUploadedlogo = logo;
      this.orgForm.controls['isTimer']?.setValue(data.isTimer ?? false);
      this.orgForm.controls['isCaptured']?.setValue(data.isCaptured ?? false);
      this.orgForm.controls['is2FA']?.setValue(data.is2FA ?? false);
      this.orgForm.controls['timer']?.setValue(data.timer ?? 0);
      this.orgForm.controls['counter']?.setValue(data.counter ?? 0);
    }
  }
  @Input() public loading;

  public get orgData(): Organization {
    return this._orgData;
  }

  private _orgData!: Organization;
  spaceRegex = /\s+/g;
  public userRole: Array<userRole> = [];

  constructor(
    private _commonService: CommonService,
    private router: Router,
    private _orgPresenterService: OrgPresenterService,
    private fb: FormBuilder
  ) {
    this.imageFileOnly = this._commonService.imageFileOnly;
    this.orgForm = this._orgPresenterService.initForm();
    this.primaryColor = '#000000';
    this.secondaryColor = '#000000';
    this.mainTitle = '';
    this.submitted = false;
  }
  ngOnInit(): void { 
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'Organization';
      });
    }
  }
  get f() {
    return this.orgForm.controls;
  }

  public onFaviconSelect(favIcon: any) {
    const file = favIcon?.target.files;
    if (file && file[0] && file[0]?.type?.includes('image/')) {
      const file = favIcon.target.files[0];
      this.orgForm.controls['imageFavicon']?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          this.uploadedFavIcon = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this._commonService.showToast('Upload Image file only', ToastType.ERROR, ToastType.ERROR);
    }
  }

  public onLogoSelect(logo: any) {
    const file = logo?.target.files;
    if (file && file[0] && file[0]?.type?.includes('image/')) {
      const file = logo.target.files[0];
      this.orgForm.controls['imageLogo']?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          this.uploadedlogo = e.target.result.trim().replace(/\s+/g, '');
        }
      };
      reader.readAsDataURL(file);
    } else {
      this._commonService.showToast('Upload Image file only', ToastType.ERROR, ToastType.ERROR);
    }
  } 
  updatePrimaryColor(color: any) {
    if (this.f['primaryColorCode'].valid) {
      this.primaryColor = color.value;
      this.orgForm.controls['primaryColorCode']?.setValue(color.value);
    }
  }
  updateSecondaryColor(color: any) {
    if (this.f['secondaryColorCode'].valid) {
      this.secondaryColor = color.value;
      this.orgForm.controls['secondaryColorCode']?.setValue(color.value);
    }
  } 
  AddOrganization() {
    this.submitted = true;

    if (this.orgForm.invalid || !this.uploadedlogo) {
      this.orgForm.markAllAsTouched();
      return;
    }

    let keys = Object.keys(this.orgForm.value);
    let formData = new FormData();
    keys.forEach((key) => {
      if (this.orgForm.value[key]) {
        formData.append(key, this.orgForm.value[key]);
      }
    });

    formData.append('isTimer', this.orgForm.controls['isTimer'].value.toString());
    formData.append('isCaptured', this.orgForm.controls['isCaptured'].value.toString());
    formData.append('is2FA', this.orgForm.controls['is2FA'].value.toString());

    // Add custom logic if needed
    if (this.orgForm?.controls['code'].value) {
      formData.append('code', this.orgForm?.controls['code'].value);
    }

    if (this.orgForm.controls['imageLogo']?.value) {
      formData.append('imageLogo', this.orgForm.controls['imageLogo'].value);
    }

    // Update the dashboard title
    const newTitle = this.orgForm?.controls['title'].value;
    this._commonService.updateTitle(newTitle);
    this.saveOrganizationSetting.emit(formData);

    const newName = this.orgForm.controls['name'].value;
    this._commonService.updateOrgName(newName);
  }

  resetFavIconUploader() {
    this.favIconUploader.nativeElement.value = null;
    this.orgForm.controls['imageFavicon']?.reset();
    this.uploadedFavIcon = this.defaultUploadedFavIcon ?? '';
  }

  resetLogoUploader() {
    this.logoUploader.nativeElement.value = null;
    this.orgForm.controls['imageLogo']?.reset();
    this.uploadedlogo = this.defaultUploadedlogo ?? '';
  }

  navigate() {
    this.router.navigateByUrl('organization-details');
  }
}
