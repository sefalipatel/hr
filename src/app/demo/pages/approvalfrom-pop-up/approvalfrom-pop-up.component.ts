import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';  // Import CommonModule
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from 'src/app/api.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ToastrService } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-approvalfrom-pop-up',
  standalone: true,
  templateUrl: './approvalfrom-pop-up.component.html',
  imports: [MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatCardModule, FormsModule, MatFormFieldModule, CommonModule, DatePipe, NgxMaterialTimepickerModule, ReactiveFormsModule],
  styleUrls: ['./approvalfrom-pop-up.component.scss'],
  providers: [DatePipe]
})

export default class ApprovalfromPopUpComponent {
  form: FormGroup;
  selectedTime: string
  selectedOutTime: string
  requestdate: Date
  loading: boolean = false
  personId: { personID: string }
  selectiontype: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  allSelectTime: any;
  regularizationList: any;
  attendanceDetailsId: any[] = [];
  isSubmitting : boolean = false
  

  constructor(
    private datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private apiservice: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private api: CommonService,
    public dialogRef: MatDialogRef<ApprovalfromPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date, id: string, requestid: string, Status: string, elementData: any }
  ) {
    this.form = this.formBuilder.group({
      PersonId: [JSON.parse(localStorage.getItem('userInfo')).personID],
      ActualTime: ['', Validators.required],
      AttendanceDetailId: ['', Validators.required],
      Reason: ['', Validators.required],
      RequestDate: [data.date],
      requestType: [1]
    });
  }

  async ngOnInit() {
    this.getAllSelectTime();
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    if (this.data.requestid) {
      this.loading = true
      const response = await this.apiservice.updateMisstingTimeEdit(this.data.requestid);
      this.loading = false
      this.form.patchValue({
        Reason: response.value.reason,
      })
      this.data.date = response.value.requestDate
      this.requestdate = response.value.requestDate
    }
  }

  onTimeChange(newTime: any) {
    this.selectedTime = newTime;
  }

  onOutTimeChange(newTime: any) {
    this.selectedOutTime = newTime;
  }

  getAllSelectTime() {
    this.api.get(`Attendance/attendanceDetails/${this.data.id}`).subscribe(res => {
      this.allSelectTime = res;
      res.map(item => {
        this.attendanceDetailsId.push(item?.attendanceId);
      });
    })
  }

  async saveData() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.form.valid) {
      this.addRegularization();
    } else {
      this.form.markAllAsTouched()
    }
    this.cdr.detectChanges();
  }

  addRegularization() {
    this.loading = true
    this.api.post('AttendanceRequest/AddAttendanceRequest', this.form.value).subscribe(res => {
      this.loading = false
      this.router.navigate(['/employee-request-details'])
      this.regularizationList = res;
      this.api.showToast('Regularization Request Added Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      this.isSubmitting = false
    })
  }

  cancelPopup() {
    this.dialogRef.close('Cancel');
  }
  onMonthSelected(data) {
    this.selectiontype = data.value
  }

  transform(value: string): string {
    if (value) {
      const date = new Date(`${value}`);
      return new DatePipe('en-US').transform(date, 'hh:mm a');
    }
    return '';
  }

  trimNameOnBlur() {
    const control = this.form.get('Reason');
    if (control?.value) {
      // Trim leading and trailing spaces only when the input loses focus
      const trimmedValue = control.value.trim();
      // Set the trimmed value back to the form control
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
