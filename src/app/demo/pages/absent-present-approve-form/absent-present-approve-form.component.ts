import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-absent-present-approve-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './absent-present-approve-form.component.html',
  styleUrls: ['./absent-present-approve-form.component.scss']
})
export class AbsentPresentApproveFormComponent {
  public absentForm: FormGroup;
  public selectedTime: string;

  constructor(private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AbsentPresentApproveFormComponent>,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date },
    private router: Router,
    private datePipe: DatePipe) {
    this.absentForm = this._fb.group({
      requestDate: [this.data.date],
      inTime: ['', Validators.required],
      outTime: ['', Validators.required],
      reason: ['', Validators.required],
      requestType: [0]
    })
  }

  submit() {
    if (this.absentForm.invalid) {
      this.absentForm.markAllAsTouched();
      return;
    }
    this.commonService.post('AttendanceRequest/AbsentPresentRequest', this.absentForm.value).subscribe(res => {
      if (res?.statusCode == 200) {
        this.commonService.showToast('Your request has been successfully sent', ToastType.SUCCESS, ToastType.SUCCESS)
        this.router.navigate(['/employee-request-details'])
      }
    }, (err) => {
      this.commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })
  }

  onTimeChange(newTime: any) {
    this.selectedTime = newTime;
  }

  cancelPopup() {
    this.dialogRef.close('Cancel');
  }
}
