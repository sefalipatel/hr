import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-add-wfh-compoff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './add-wfh-compoff.component.html',
  styleUrls: ['./add-wfh-compoff.component.scss']
})
export class AddWfhCompoffComponent {
  startHalfenum = [
    { value: 0, key: 'First Half' },
    { value: 1, key: 'Second Half' }
  ];

  public imageFileOnly: string;
  selectedOption: number;
  personId: { personID: string };
  loading = false;
  leaveID: string;
  approvaldate: Date;
  todayDate = moment(new Date()).subtract(14, 'days').toDate();
  nextDate: Date = moment(new Date()).add(1, 'days').toDate();
  maxNextDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  form: FormGroup;
  showErrors = false;
  isSubmitting = false;
  File: File | null = null;
  uploadedlogo: string | null = null;
  defaultUploadedlogo: string | null = null;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  @ViewChild('favIconUploader') favIconUploader!: ElementRef;
  id: string = '';
  leaveTypeList: any[] = [];
  leaveTypeCardList: any[] = [];
  userType: string = '';
  selectiontype: any;

  availableBalance = 0;
  currentBooking = 0;
  balanceAfterBooking = 0;

  constructor(
    public dialogRef: MatDialogRef<AddWfhCompoffComponent>,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.imageFileOnly = this._commonService.imageFileOnly;
    this.form = this.formBuilder.group({
      id: '',
      personId: '',
      LeaveTypeId: ['', Validators.required],
      StartDate: [new Date(), Validators.required],
      Reason: ['', [Validators.required, Validators.maxLength(1000)]],
      Approval: 0,
      ApprovedBy: '',
      ApprovedOn: '',
      RejectionReason: '',
      Leave: ''
    });
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.personId = JSON.parse(localStorage.getItem('userInfo') || '{}');

    this.leaveID = this.route.snapshot.params['id'];
    this.userType = this.route.snapshot.queryParams['user'];
    this.approvaldate = this.route.snapshot.queryParams['data'];

    if (this.approvaldate) {
      this.form.get('StartDate')?.setValue(this.approvaldate);
    }
    const passedDate = this.dialogData?.date;

    if (passedDate) {
      this.form.get('StartDate')?.setValue(passedDate);
    }
    this.getAllLeaveType();
    this.getAllCardLeaveType();

    if (this.leaveID) {
      this.loadLeaveDetails();
    }

    this.form.valueChanges.subscribe(() => {
      this.updateBookingBalance();
    });
  }

  getAllLeaveType() {
    this._commonService.get('LeaveType').subscribe((res: any) => {
      if (res.statusCode === 200) {
        // Filter only the 'CompOff' and 'WorkFromHome' leave types
        const filtered = res?.value?.filter((x: any) => x.name === 'CompOff' || x.name === 'WorkFromHome') || [];
        this.leaveTypeList = filtered;

        const passedType = this.dialogData?.leaveType;
        const matched = filtered.find((x) => x.name === passedType);

        if (matched) {
          // Set the LeaveTypeId from the matched leave type
          this.form.get('LeaveTypeId')?.setValue(matched.id);
          this.form.get('LeaveTypeId')?.disable(); // Disable if needed
        }
      }
    });
  }

  async loadLeaveDetails() {
    try {
      const response = await this.apiService.getByIdLeave(this.leaveID);
      this.loading = false;
      this.selectiontype = response.leaveTypeId;
      this.personId = response.personId;

      if (response.leaveFile) {
        this.defaultUploadedlogo = this.imageUrl + response.leaveFile.replace('wwwroot', '');
        this.uploadedlogo = this.defaultUploadedlogo;
      }

      this.form.patchValue({
        id: response.id,
        personId: response.personId,
        LeaveTypeId: response.leaveTypeId,
        StartDate: response.startDate,
        Reason: response.reason,
        Approval: response.approval,
        ApprovedBy: response.approvedBy,
        ApprovedOn: response.approvedOn,
        RejectionReason: response.rejectionReason
      });
    } catch (error) {
      console.error(error);
    }
  }

  get isWFHSelected(): boolean {
    const selectedId = this.form.get('LeaveTypeId')?.value;
    const selected = this.leaveTypeList.find((x) => x.id === selectedId);
    return selected?.name === 'WorkFromHome';
  }

  OnSelectedFile(e: any) {
    const file = e?.target?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.File = file;
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.uploadedlogo = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this._commonService.showToast('Only image files are allowed', ToastType.ERROR, ToastType.ERROR);
    }
  }

  resetLogoUploader() {
    this.favIconUploader.nativeElement.value = null;
    this.File = null;
    this.uploadedlogo = this.defaultUploadedlogo ?? '';
  }
  saveData() {
    this.showErrors = true;
    this.isSubmitting = true;

    // Ensure valid LeaveTypeId is passed
    const selectedLeaveType = this.leaveTypeList.find((x) => x.id === this.form.get('LeaveTypeId')?.value);
    const leaveTypeId = selectedLeaveType?.id;

    if (!this.form.valid || !leaveTypeId) {
      this.form.markAllAsTouched();
      this.loading = false;
      this.isSubmitting = false;
      return;
    }
    this.loading = true;

    const formData = new FormData();
    formData.append('personId', this.personId?.personID || '');
    formData.append('wfhDate', moment(this.form.value.StartDate).format('YYYY-MM-DD'));
    formData.append('LeaveTypeId', leaveTypeId);
    formData.append('reason', this.form.get('Reason')?.value || '');

    if (this.isWFHSelected && this.File) {
      formData.append('Leave', this.File);
    }

    this._commonService.post('EmployeeWFHCompOff', formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.isSubmitting = false;
        if (response?.statusCode === 200) {
          // Check if it's WFH or CompOff and show the respective success message
          const leaveTypeName = selectedLeaveType?.name;
          if (leaveTypeName === 'WorkFromHome') {
            this.toastr.success('Work From Home leave applied successfully', 'Success!');
          } else if (leaveTypeName === 'CompOff') {
            this.toastr.success('CompOff leave applied successfully', 'Success!');
          }
          this.dialogRef.close('success');
          this.form.reset();
          this.File = null;
          this.uploadedlogo = null;
          this.defaultUploadedlogo = null;
          this.favIconUploader.nativeElement.value = '';
          this.dialogRef.close('success');
        } else {
          const errorMsg = response?.errors?.[0]?.errorMessage || 'Something went wrong!';
          this.toastr.error(errorMsg, 'Error!');
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.isSubmitting = false;
        const msg = error?.error?.errors?.[0]?.errorMessage || error?.message || 'Internal server error';
        this.toastr.error(msg, 'Error!');
      }
    });
  }

  trimNameOnBlur() {
    const control = this.form.get('Reason');
    if (control?.value) {
      const trimmed = control.value.trim();
      control.setValue(trimmed, { emitEvent: false });
    }
  }

  calculateLeaveDays(): number {
    return 1; // WFH/CompOff is single day
  }

  updateBookingBalance() {
    this.currentBooking = this.calculateLeaveDays();
    this.balanceAfterBooking = Math.max(this.availableBalance - this.currentBooking, 0);
  }

  getAllCardLeaveType() {
    this._commonService.get(`EmployeeLeave/PersonLeave?personId=${this.personId.personID}`).subscribe((res: any) => {
      if (res) this.leaveTypeCardList = res || [];
    });
  }

  cancelPopup(): void {
    this.dialogRef.close('Cancel');
  }

  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
}
