import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-add-over-time',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './add-over-time.component.html',
  styleUrls: ['./add-over-time.component.scss']
})
export class AddOverTimeComponent implements OnInit {
  public overtimeForm: FormGroup

  constructor(public dialogRef: MatDialogRef<AddOverTimeComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { id: any, date: Date },
    private commonService: CommonService,
    private datePipe: DatePipe) {
    this.overtimeForm = this.formBuilder.group({
      otHour: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      description: ['', Validators.required]
    })
  }

  ngOnInit(): void {

  }

  cancelPopup() {
    this.dialogRef.close('Cancel');
  }
  receivedDate: any
  submit() {
    if (this.overtimeForm.invalid) {
      this.overtimeForm.markAllAsTouched();
      return;
    }
    this.receivedDate = this.datePipe.transform(this.data.date, 'yyyy-MM-dd');
    const payload = {
      personId: this.data.id,
      otDate: this.receivedDate,
      ...this.overtimeForm.value
    }
    if (this.data.id) {
      this.commonService.post('Overtime', payload).subscribe(res => {
        if (res?.statusCode === 200) {
          this.commonService.showToast('Overtime requested successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        }
      }, (err) => {
        this.commonService.showToast('Error requesting overtime', ToastType.ERROR, ToastType.ERROR)
      })
      this.dialogRef.close('Cancel');
    }
  }

  trimNameOnBlur() {
    const control = this.overtimeForm.get('description');
    if (control?.value) {
      // Trim leading and trailing spaces only when the input loses focus
      const trimmedValue = control.value.trim();
      // Set the trimmed value back to the form control
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
