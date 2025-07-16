import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-contact-social-profile',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './contact-social-profile.component.html',
  styleUrls: ['./contact-social-profile.component.scss']
})
export class ContactSocialProfileComponent {
  public socialForm: FormGroup;
  @Input() public set contactId(id: string) {
    this._contactId = id;
  }
  public get contactId() {
    return this._contactId;
  }
  private _contactId: string;

  @Input() public set getContactDataById(data) {
    this._getContactDataById = data;
    if (this.contactId) {
      this.socialForm.patchValue(this._getContactDataById?.contactSocialMedia)
    }
  }
  public get getContactDataById(): any {
    return this._getContactDataById;
  }
  private _getContactDataById: any;

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
  trimNameOnBlur(controlName: string) {
    const control = this.socialForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
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
      contactPersonId: this.contactId,
      ...this.socialForm.value
    }
    this._commonService.put('Contact/UpdateContactSocialMedia', payload).subscribe(res => {
      if (res) {
        this._commonService.showToast('Social media has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.onList();
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  onList() {
    this.router.navigate(['contact/information']);
  }

}
