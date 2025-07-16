import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { environment } from 'src/environments/environment';
import { MatRadioModule } from '@angular/material/radio';
import moment from 'moment';
declare var bootstrap: any;
@Component({
  selector: 'app-new-apply-leave',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    NgFor,
    MatCardModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatButtonModule, MatDividerModule, MatRadioModule
  ],
  templateUrl: './new-apply-leave.component.html',
  styleUrls: ['./new-apply-leave.component.scss']
})
export class NewApplyLeaveComponent {
  startHalfenum: { value: number, key: string }[] = [
    { value: 0, key: "First Half" },
    { value: 1, key: "Second Half" },
  ]

  public imageFileOnly: string;
  selectedOption: number;
  personId: { personID: string }
  loading: boolean = false;
  leaveID: string;
  approvaldate: Date
  todayDate = moment(new Date()).subtract(14, 'days').toDate();
  maxDate: any
  nextDate: Date = moment(new Date()).add(1, 'days').toDate();
  maxNextDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  endHalfenum: any
  form: FormGroup;
  showErrors: boolean = false;
  isView?: boolean;
  selectiontype: any
  File: File | undefined;
  id: string = '';
  public userType: string = '';
  isSubmitting: boolean = false
  uploadedlogo;
  defaultUploadedlogo;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  @ViewChild('favIconUploader') favIconUploader!: ElementRef;

  public leaveTypeList: any[] = [];
  public leaveTypeCardList: any[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _commonService: CommonService
  ) {
    this.imageFileOnly = this._commonService.imageFileOnly;
    this.form = this.formBuilder.group({
      id: '',
      personId: '',
      LeaveTypeId: ['', Validators.required],
      StartDate: [new Date(), Validators.required],
      StartHalf: ['', Validators.required],
      EndDate: ['', Validators.required],
      EndHalf: ['', Validators.required],
      Reason: ['', [Validators.required, Validators.maxLength(1000)]],
      Approval: 0,
      ApprovedBy: '',
      ApprovedOn: '',
      RejectionReason: '',
      Leave: '',
    });
    var currentDate = new Date(); 
  }

  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.route.params.subscribe(async (params) => {
      this.leaveID = params['id'];
    });

    this.route.queryParams.subscribe(queryParams => {
      this.userType = queryParams['user']
    });
    this.approvaldate = this.route.snapshot.queryParams['data'];

    if (this.approvaldate) {
      this.form.get("StartDate").setValue(this.approvaldate),
        this.form.get("EndDate").setValue(this.approvaldate)
    }
    this.getAllLeaveType();
    this.getAllCardLeaveType();
    if (this.leaveID) {
      try {
        const response = await this.apiService.getByIdLeave(this.leaveID);
        this.loading = false
        this.selectiontype = response.leaveTypeId;
        this.personId = response.personId;
        if (response.leaveFile) {
          this.defaultUploadedlogo = this.imageUrl + response.leaveFile?.replace('wwwroot', '');
          this.uploadedlogo = this.imageUrl + response.leaveFile?.replace('wwwroot', '');
        }
        this.form.patchValue({
          id: response.id,
          personId: response.personId,
          LeaveTypeId: response.leaveTypeId,
          StartDate: response.startDate,
          StartHalf: response.startHalf,
          EndHalf: response.endHalf,
          EndDate: response.endDate,
          Reason: response.reason,
          Approval: response.approval,
          ApprovedBy: response.approvedBy,
          ApprovedOn: response.approvedOn,
          RejectionReason: response.rejectionReason
        });
      } catch (error) { }
    } 



    this.form.valueChanges.subscribe(() => {
      this.updateBookingBalance();
    });
  }


  getAllLeaveType() {
    this._commonService.get('LeaveType').subscribe((res: any) => {
      if (res.statusCode === 200) {
        this.leaveTypeList = res?.value || [];
        this.form.get('LeaveTypeId')?.setValue(res?.value[0]?.id);
        this.selectionchange(res?.value[0]?.id);
      }
    });
  }

  removeTimeFromDate(date: Date): Date {
    if (date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }
    return new Date();
  }

  onList() {
    if (this.approvaldate) {
      this.router.navigate(['/Attendance']);
    } else if (this.userType) {
      this.router.navigate(['/employee-leave-details']);
    } else {
      this.router.navigate(['/new-leave-detail']);
    }
  }

  get StartDate() {
    return this.form.get('StartDate');
  }
  get EndDate() {
    return this.form.get('EndDate');
  }
  get Reason() {
    return this.form.get('Reason');
  }

  async saveData() {

    const datePipe = new DatePipe('en-US');
    const formattedStartDate = datePipe.transform(this.form.value.StartDate, 'yyyy-MM-dd');
    this.form.patchValue({ StartDate: formattedStartDate });
    const formattedEndDate = datePipe.transform(this.form.value.EndDate, 'yyyy-MM-dd');
    this.form.patchValue({ EndDate: formattedEndDate });
    this.loading = true
    this.form.patchValue({ date: this.removeTimeFromDate(this.form.value.startDate) });
    this.showErrors = true

    if (this.isSubmitting) {
      return
    }

    this.isSubmitting = true
    if (this.form.valid || (this.selectiontype == 1 && this.File)) {
      if (this.leaveID) {
        this.form.get("personId").setValue(this.personId)
        this.form.get('Approval').setValue(0);
        this.form.get('Leave').setValue(this.File)
        let keys = Object.keys(this.form.value);
        let formData = new FormData();
        keys.forEach(key => {
          let value = this.form.value[key];
          if (value || value == 0) {
            formData.append(key, value);
          }
        });
        const response = await this.apiService.leaveUpdate(formData);
        this.loading = false
        if (response.status === 200) {
          this.toastr.success('Leave updated successfully', 'Success!');
          this.isSubmitting = false
          this.onList();
          this.form.reset();
        }
        else if (response.statusCode === 400) {
          this.toastr.error(response.errors[0]?.errorMessage); 
        }
        else if (response.statusCode === 500) {
          this.toastr.error(response.errors[0]?.errorMessage);
          this.loading = false
        }
      }
      else {
        try {
          this.form.get("personId").setValue(this.personId.personID);
          this.form.removeControl('id');
          this.form.get('Leave').setValue(this.File);

          const keys = Object.keys(this.form.value);
          const formData = new FormData();
          keys.forEach(key => {
            const value = this.form.value[key];
            if (value || value === 0) {
              formData.append(key, value);
            }
          });

          const response = await this.apiService.LeaveDetailsAdd(formData);
          this.loading = false;

          if (response.status === 200) {
            this.toastr.success('Leave applied successfully', 'Success!');
            this.isSubmitting = false;
            this.onList();
            this.form.reset();
          } else {
            // Fallback if response doesn't have proper structure
            const errorMsg = response?.errors?.[0]?.errorMessage || 'Something went wrong!';
            this.toastr.error(errorMsg);
          }
        } catch (error) {
          this.loading = false;
          this.isSubmitting = false;
          const err = error?.response?.data?.errors[0]?.errorMessage || error; // in case API wraps error in `response`

          const errorMsg = err || 'Internal Server Error';
          this.toastr.error(errorMsg);
          console.error('API error:', error);
        }
      }

      this.loading = false
    } else {
      this.loading = false
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
    }
  }
  navigate = function () {
    this.router.navigateByUrl('/leave-details');
  };

  selectionchange(data) {
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.selectiontype = data.value ?? data;
    this.availableBalance = 0;
    this._commonService.get(`EmployeeLeave/PersonLeaveCountByLeaveTypeId?personId=${personId}&leaveTypeId=${this.selectiontype}`).subscribe((res: any) => {
      if (res) {
        this.availableBalance = res[0]?.remainingLeaveDays;
        this.updateBookingBalance();
      }
    });
  }
  
  OnSelectedFile(e) {
    const file = e?.target.files;
    if (file && file[0] && file[0]?.type?.includes("image/")) {
      const file = e.target.files[0];
      this.File = file
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          this.uploadedlogo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this._commonService.showToast('Upload image file only', ToastType.ERROR, ToastType.ERROR)
    }
  }

  resetLogoUploader() {
    this.favIconUploader.nativeElement.value = null;
    this.File = null;
    this.uploadedlogo = this.defaultUploadedlogo ?? '';
  }

  trimNameOnBlur() {
    const control = this.form.get('Reason');
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

  // dynamic leave calculation
  availableBalance: number = 0;
  currentBooking: number = 0;
  balanceAfterBooking: number = 0;
  calculateLeaveDays(): number {
    const startDate = this.form.value.StartDate;
    const endDate = this.form.value.EndDate;
    const startHalf = this.form.value.StartHalf;
    const endHalf = this.form.value.EndHalf;

    if (!startDate || !endDate || startHalf == null || endHalf == null) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Normalize time to 00:00 for accurate day diff
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    let totalDays = 0;

    if (start.toDateString() === end.toDateString()) {
      if (startHalf === 0 && endHalf === 0) {
        totalDays = 0.5;
      } else if (startHalf === 1 && endHalf === 1) {
        totalDays = 0.5;
      } else {
        totalDays = 1;
      }
    } else {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24); // no floor, we normalize time
      totalDays = diffDays;

      // Adjust for halves
      totalDays += (startHalf === 0 ? 1 : 0.5); // start day contribution
      totalDays += (endHalf === 0 ? -0.5 : 0);  // end day adjustment
    }

    return totalDays;
  }


  updateBookingBalance() {
    this.currentBooking = this.calculateLeaveDays();
    this.balanceAfterBooking = Number(this.availableBalance - this.currentBooking) > 0 ? Number(this.availableBalance - this.currentBooking) : 0;
  }

  getAllCardLeaveType() {
    this._commonService.get(`EmployeeLeave/PersonLeave?personId=${this.personId.personID}`).subscribe((res: any) => {
      if (res) {
        this.leaveTypeCardList = res || [];
      }
    });
  }
  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
  openOffcanvas() {
    const canvas = document.getElementById('offcanvasRight');
    const bsOffcanvas = new bootstrap.Offcanvas(canvas);
    bsOffcanvas.show();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }
}
