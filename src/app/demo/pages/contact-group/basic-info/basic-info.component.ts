import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule],
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BasicInfoComponent implements OnInit {
  public basicInfoForm: FormGroup;
  @Input() contactId: string;
  @Input() public set getContactDataById(data: any) {
    this._getContactDataById = data;
    if (this.contactId) {
      this.basicInfoForm.patchValue(this._getContactDataById?.contactPerson)
    }
  }
  public get getContactDataById(): any {
    return this._getContactDataById;
  }
  private _getContactDataById: any;
  contactType = [
    { name: 'Company', value: 0 },
    { name: 'Person', value: 1 }
  ];
  visibility = [
    { name: 'Private', value: false },
    { name: 'Public', value: true }
  ]
  isSubmitting: boolean = false;
  constructor(private _fb: FormBuilder, private router: Router, private _commonService: CommonService) {
    this.basicInfoForm = this.buildForm()
  }

  ngOnInit() {
  }

  buildForm() {
    return this._fb.group({
      isPublic: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      description: [''],
      alternateNumber: [''],
      status: [true]
    })
  } 

  submit() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;

    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    let payload = this.contactId
      ? { id: this.contactId, ...this.basicInfoForm.value }
      : this.basicInfoForm.value;

    const apiCall = this.contactId
      ? this._commonService.put('Contact', payload)
      : this._commonService.post('Contact', payload);

    apiCall.subscribe(
      (res) => {
        if (res?.statusCode === 200) {
          const message = this.contactId
            ? 'Contact updated successfully'
            : 'Contact added successfully';
          this._commonService.showToast(message, ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.onList();
        }
      },
      (error) => {
        this.handleBackendErrors(error);
      }
    );
  }
  handleBackendErrors(error) {
    this.isSubmitting = false;

    if (error.error?.errors?.ContactNumber) {
      const backendError = error.error.errors.ContactNumber[0]; // Get the first error message
      this._commonService.showToast(backendError, ToastType.ERROR, ToastType.ERROR);
    } else {
      this._commonService.showToast('Invalid Phone Number', ToastType.ERROR, ToastType.ERROR);
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.basicInfoForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

  onList() {
    this.router.navigate(['contact/information']);
  }
}
