import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-missing-time-add',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, DatePipe, NgxMaterialTimepickerModule],
  templateUrl: './missing-time-add.component.html',
  styleUrls: ['./missing-time-add.component.scss'],
  providers: [DatePipe]
})

export default class MissingTimeAddComponent {
  personId: { personID: string }
  getapprovalDate: Date
  requestId: string
  time? = new Date();
  selectedTime: string
  selectedOutTime: string
  requestdate: Date
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: ApiService,
    private datepipe: DatePipe) {
    this.form = this.formBuilder.group({
      PersonId: " ",
      RequestType: 2,
      Status: 0,
      AttendanceRequestId: "",
      INTIME: ['', Validators.required],
      OUTTIME: ['', Validators.required],
      REASON: ['', Validators.required],
      RequestDate: [, ""],
    });
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = params['id'];
    });
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    if (this.requestId) {
      const response = await this.apiservice.updateMisstingTimeEdit(this.requestId);
      const INTIME = this.datepipe.transform(response.value.inTime, 'h:mm a')
      const OUTTIME = this.datepipe.transform(response.value.outTime, 'h:mm a')
      this.requestdate = response.value.requestDate
      if (response) {
        this.form.patchValue({
          INTIME: INTIME,
          OUTTIME: OUTTIME,
          REASON: response.value.reason,
        })
      }
    }
    const selectedOption = this.route.snapshot.queryParams['data'];
    this.getapprovalDate = selectedOption
  }

  async onSubmit() {
    if (this.requestId) {
      this.form.get("PersonId").setValue(this.personId.personID)
      this.form.get("AttendanceRequestId").setValue(this.requestId)
      this.form.get("RequestDate").setValue(this.requestdate)
      this.form.removeControl("RequestDate")
      const reponse = await this.apiservice.updateMisstingTime(this.form.value)
      if (reponse) {
        this.toastr.success('update request!', 'Success!')
        this.form.reset()
      }
    } else {
      this.form.get("RequestDate").setValue(this.datepipe.transform(this.getapprovalDate, "yyyy-MM-dd"))
      const formData = this.form.value;
      const response = await this.apiservice.missingTimeAdd(formData)
      if (response) {
        this.toastr.success('approve request!', 'Success!')
      }
      this.form.reset();
    }
  }

  cancle() {
    this.router.navigateByUrl('Attendance');
  }

  onTimeChange(newTime: any) {
    this.selectedTime = newTime;
  }
  onOutTimeChange(newTime: any) {
    this.selectedOutTime = newTime;
  }

}


