import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-resignation-form',
  standalone: true,
  templateUrl: './resignation-form.component.html',
  styleUrls: ['./resignation-form.component.scss'],
  imports: [CommonModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, AngularEditorModule, MatCardModule]
})
export class ResignationFormComponent implements OnInit {
  resignationForm: FormGroup;
  resignationCancleForm: FormGroup;
  resignationNo: boolean = false;
  resignationYes: boolean = false;
  resignationmsg: boolean = false;
  resignatoninLastDate: boolean = false;
  resignationcancelmsg: boolean = false;
  resignationcancelfrom: boolean = false;
  resignationId: string;
  isView: boolean;
  joiningDate: string;
  noticeDate: string;
  resignationDone: boolean = false;
  dateFormat: string = localStorage.getItem('Date_Format');
  resignationPersonData = [];
  resignationReason: string;
  resignationApproval: string;
  resignationCancel: boolean = true;
  resignationClicked : boolean = false; 

  constructor(
    private _fb: FormBuilder,
    private api: CommonService, private apiService: ApiService) {
    this.resignationForm = this.buildForm();
    this.resignationCancleForm = this._fb.group({
      cancelreason: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.api.get(`Person/${personId}`).subscribe(
      (response) => {
        this.joiningDate = response.value.doj;
        localStorage.setItem('birthDay', response?.value?.dob)
        localStorage.setItem('anniversary', response?.value?.doj)
      }
    );

    this.getEmployeedResignation();
  }
  getEmployeedResignation() {
    this.api.get('Resignation/GetByEmployeeId').subscribe((response) => {
      this.resignationPersonData = response;
      if (this.resignationPersonData.length > 0) {

        this.resignationPersonData.map((item) => {
          this.resignationReason = item?.reason;
          this.noticeDate = item?.noticeDate;
          this.resignationApproval = item?.approvedBy;
          this.resignationCancel = item?.cancellationReason;
          this.resignationId = item?.id;
          if (this.resignationCancel) {
            this.resignationNo = false;
            this.resignationmsg = false;
            this.resignationYes = false;
            this.resignatoninLastDate = false;
          } else {
            this.resignationNo = false;
            this.resignationmsg = false;
            this.resignationYes = false;
            this.resignatoninLastDate = true;
          }

        })

      } else {
        this.resignationNo = false;
      }
    })
  }
  buildForm() {
    return this._fb.group({
      reason: ['', [Validators.required]],
    });
  }

  trimResonOnBlur() {
    const control = this.resignationForm.get('reason');
    if (control?.value) {
      const trimmedValue = control.value.trim(); 
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

  trimCancelReasonOnBlur() {
    const control = this.resignationCancleForm.get('cancelreason');
    if (control?.value) {
      const trimmedValue = control.value.trim(); 
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

  cancel() {
    this.resignationNo = true;
    this.resignationYes = false;
    this.resignationmsg = false;
    this.resignationClicked = false;
    this.resignationForm.reset()
  }

  //resignation button call function
  resignationMsg() {
    if (!this.resignationClicked) {
    this.resignationmsg = true;
    this.resignationNo = false;
    this.resignationCancel = true;
    }
  }

  //resason add
  async saveReason() {
    if (this.resignationId && this.resignationCancel == null) {
      if (this.resignationCancleForm.invalid) {
        this.resignationCancleForm.markAllAsTouched();
        return;
      }
      let obj = { 'Id': this.resignationId, 'CancellationReason': this.resignationCancleForm.get('cancelreason').value }
      let result = await this.apiService.CancellationReason(obj);
      if (result) {
        this.api.showToast('Resignation Cancelled Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
        this.resignationcancelfrom = false;
        this.resignatoninLastDate = false;
        this.resignationcancelmsg = false;
        this.resignationmsg = false;
        this.resignationcancelfrom = false;
        this.resignationYes = false
        this.resignationNo = true;
        this.resignationCancel = true;
        this.getEmployeedResignation();
      }

    }
    else {
      if (this.resignationForm.invalid) {
        this.resignationForm.markAllAsTouched();
        return;
      }
      let obj = { 'Reason': this.resignationForm.get('reason').value }
      let result = await this.apiService.addReson(obj);

      if (result) {
        this.api.showToast('Resignation Applied Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
        this.resignatoninLastDate = true;
        this.resignationYes = false;
        this.noticeDate = result.value.noticeDate;
        this.resignationId = result.value.id;
        this.resignationNo = false;
        this.getEmployeedResignation();
      }
    }
    this.resignationForm.reset()
  }

  //resignation from open call function
  yes() {
    if (!this.resignationClicked) {
      this.resignationYes = true;
      this.resignationmsg = false;
      this.resignationCancel = true;
      this.resignationClicked = true;
    }
  }

  //cancel resignation button call function
  cancelResignation() {
    this.resignationcancelmsg = true;
    this.resignatoninLastDate = false;
    this.resignationClicked = false;
  }


  //resignation cancel yes
  async resignationCancelYes() {
    this.resignationcancelfrom = true;
    this.resignationcancelmsg = false;
    this.resignationClicked = false;

    this.resignationCancleForm.reset();
  }

  //resignation cancel no
  resignationcancelNo() {
    this.resignationcancelmsg = false;
    this.resignatoninLastDate = true;
    this.resignationmsg = false;
    this.resignationcancelfrom = false;
    this.resignationYes = false
  }
}
