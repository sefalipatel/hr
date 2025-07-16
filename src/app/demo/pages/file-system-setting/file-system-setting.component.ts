import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColorPickerModule } from 'primeng/colorpicker';
import { userRole } from 'src/app/assets.model';
import test from 'node:test';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
export enum StorageType {
  FileSystem = 0,
  AzureBlob = 1,
  AwsCloud = 2
}

@Component({
  selector: 'app-file-system-setting',
  standalone: true,
  imports: [CommonModule, SharedModule, ColorPickerModule, MatFormFieldModule, MatProgressSpinnerModule],
  templateUrl: './file-system-setting.component.html',
  styleUrls: ['./file-system-setting.component.scss']
})
export class FileSystemSettingComponent {

  public fileStorageForm: FormGroup;
  public spaceRegex: RegExp;
  public userRole: Array<userRole>;
  public fileStorageTye: any[];
  getAllorganizationStorage: any;

  constructor(private _fb: FormBuilder,private commonservice: CommonService,private router: Router) {
    this.fileStorageForm = this._initForm();
    this.spaceRegex = /\s+/g;
    this.userRole = [];
    this.fileStorageTye = [
      { name: 'FileSystem', value: 0 },
      { name: 'AzureBlob', value: 1 },
      { name: 'AwsCloud', value: 2 }];
  }

  ngOnInit(): void {
    this.getAllOrganizationStorage()
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "GeneralSettings";
      })
    }
  }
  get f() {
    return this.fileStorageForm.controls;
  }

  AddOrganization() {
    if (this.fileStorageForm.invalid) {
      this.fileStorageForm.markAllAsTouched();
      return;
    }
    let keys = Object.keys(this.fileStorageForm.value)
    let formData = new FormData();
    keys.map(x => {
      if (this.fileStorageForm.value[x]) {
        formData.append(x, this.fileStorageForm.value[x])
      }
    })
    if (this.fileStorageForm?.controls['storageType'].value) {
      formData.append('storageType', this.fileStorageForm?.controls['storageType'].value)
    }
  }
  onfilestorage(event){ 
if (event > 0 ){
  this.fileStorageForm.addControl( 'apiurl', this._fb.control('', [Validators.required, ]))
  this.fileStorageForm.addControl( 'apiSecret', this._fb.control('', [Validators.required]))
  this.fileStorageForm.addControl( 'apiKey', this._fb.control('', [Validators.required, ]))
} else{
  this.fileStorageForm.removeControl( 'apiurl')
  this.fileStorageForm.removeControl( 'apiSecret')
  this.fileStorageForm.removeControl( 'apiKey')
}

if(this.getAllorganizationStorage?.length && event == this.getAllorganizationStorage[this.getAllorganizationStorage?.length-1]?.storageType){
  this.fileStorageForm.patchValue(this.getAllorganizationStorage[this.getAllorganizationStorage?.length-1])
}
  }

  private _initForm(): FormGroup {
    return this._fb.group({
      storageType: ['', [Validators.required]],
      organizationId: [localStorage.getItem('orgId'), [Validators.required]],
      isActive: [true]
    })
  }
  public saveConfig() {
    if (this.fileStorageForm.invalid || this.fileStorageForm.invalid) {
      this.fileStorageForm.markAllAsTouched(); 
      return;
    }
    this.commonservice.post('OrganizationStorage', this.fileStorageForm.value).subscribe((res) => {
      if (res?.id) {
        this.commonservice.showToast('Email setting saved successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      }
    }, (err) => {

    })
  }
  navigate = function () {
    this.router.navigateByUrl('/organization-details');
  };

  getAllOrganizationStorage() {
    this.commonservice.get(`OrganizationStorage`).subscribe((x) => {
      this.getAllorganizationStorage = x;
      this.onfilestorage(this.getAllorganizationStorage[this.getAllorganizationStorage?.length-1]?.storageType)
    })
  }
}
