import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-social-profile',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './social-profile.component.html',
  styleUrls: ['./social-profile.component.scss']
})
export class SocialProfileComponent {
  public socialForm: FormGroup;

  @Input() public set companyId(id: string) {
    this._companyId = id;
    if (id) {
    }
  }
  public get companyId(): string {
    return this._companyId;
  }
  private _companyId!: string;

  @Input() public set getDataById(data: any) {
    this._getDataById = data;
    if (this._companyId) {
      this.socialForm.patchValue(this._getDataById?.companySocialMedias)
    }
  }
  public get getDataById() {
    return this._getDataById;
  }
  private _getDataById: any;


  constructor(private _fb: FormBuilder, private router: Router, private _commonService: CommonService) {
    this.socialForm = this.buildForm();
  }

  buildForm() {
    return this._fb.group({
      facebook: [''],
      twitter: [''],
      linkedin: [''],
      skype: [''],
      whatsapp: [''],
      instagram: ['']
    })
  }

  submit() {
    if (!this.socialForm.dirty) {
      return;
    }

    let isValid = true;

    // Check if any field is empty after trimming
    Object.keys(this.socialForm.controls).forEach((key) => {
      const control = this.socialForm.get(key);
      if (control && typeof control.value === 'string' && control.value.trim() === '') {
        control.setValue(''); // Set empty string to avoid spaces
        isValid = false;
      }
    });
    if (!isValid) {
      return; // Prevent form submission if any field is empty
    }  
    let payload = {
      personId: this._companyId,
      ...this.socialForm.value
    }
    this._commonService.put('CompanyPerson/UpdateSocialMedias', payload).subscribe(res => {
      if (res) {
        this.onList();
        this._commonService.showToast('Social profile has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }
  trimNameOnBlur(controlName: string) {
    const control = this.socialForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
  onList() {
    this.router.navigate(['company-list']);
  }
}
