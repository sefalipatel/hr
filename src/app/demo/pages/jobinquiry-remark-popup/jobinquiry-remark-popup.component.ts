import { ChangeDetectorRef, Component, Inject, NgZone, Output, EventEmitter } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeaveStatus } from '../user-leave/user-leave.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
@Component({
  selector: 'app-jobinquiry-remark-popup',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './jobinquiry-remark-popup.component.html',
  styleUrls: ['./jobinquiry-remark-popup.component.scss']
})
export class JobinquiryRemarkPopupComponent {
  personId: { personID: string };
  form: FormGroup;
  loading: boolean = false;
  selectiontype: any;
  @Output() remarks: EventEmitter<any> = new EventEmitter();
  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private apiService: ApiService,
    private zone: NgZone,
    private formBuilder: FormBuilder,
    private _commonService: CommonService,
    public dialogRef: MatDialogRef<JobinquiryRemarkPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date; id: string; requestid: string; dataSource }
  ) {
    this.form = this.formBuilder.group({
      remarks: [''],
      status: ['']
    });
  }
  Submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.valid) {
      let id =this.data.id
      let remark = this.form.value.remarks;
      let status = this.form.value.status;
      this.remarks.emit({remark : remark, status: status,id:id})
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancle() {
    this.dialogRef.close('Cancel');
  }
  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
  }
  selectionchange(data) {
    this.selectiontype = data.value;
  }
  jobStatusOptions = [
    { value: 0, status: 'Short listed' },
    { value: 1, status: 'Rejected' },
    { value: 2, status: 'In Pipeline' }
  ];
}
