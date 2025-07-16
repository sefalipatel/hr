import { ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeaveStatus } from '../user-leave/user-leave.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-remark-pop-up',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, SharedModule, CommonModule],
  templateUrl: './remark-pop-up.component.html',
  styleUrls: ['./remark-pop-up.component.scss']
})
export class RemarkPopUpComponent implements OnInit{
  personId: { personID: string }
  form: FormGroup;
  loading: boolean = false;
  isAdvanceStatus: boolean = false;
  constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService,
    private _commonService: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RemarkPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string, status: number,isAdvance?: boolean,reason: string, dataSource }) {
    this.form = this.formBuilder.group({
      status: [],
      reason: [""]
    })

    this.isAdvanceStatus = data?.isAdvance

  }

  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
  }
  buttonDisabledState: { [key: number]: boolean } = {};

  async Reject() {

    this.loading = true;

    if (this.isAdvanceStatus === true) {
      let advancePayload = {
        id: this.data?.dataSource?.id,
        status: this.data?.status,
        remark: this.form.value.reason
      }
      const response = this._commonService.put(`Advance/UpdateAdvanceStatus`, advancePayload).subscribe(res => {

        if (res && this.data?.status === 1) {
          res ? this.toastr.success('Advance Approved') : this.toastr.error('Something Went Wrong');
        }
        else if (res && this.data?.status === 2) {
          res ? this.toastr.error('Advance Rejected') : this.toastr.error('Something Went Wrong');
        }
        return res;
      }, err => {
        this.toastr.error('Something Went Wrong');
      });
      this.loading = false;


      this.dialogRef.close('Submit'); 
    }
    else {
      let payload = { 
        id: this.data?.dataSource?.id,
        loanStatus: this.data?.status,
        remarks: this.form.value.reason
      }
      const response = this._commonService.put(`EmployeeLoan/updatestatus`, payload).subscribe(res => {
        if (response && this.data?.status === 1) {
          response ? this.toastr.success('Loan Approved') : this.toastr.error('Something Went Wrong');
        }
        else if (response && this.data?.status === 2) {
          response ? this.toastr.error('Loan Rejected') : this.toastr.error('Something Went Wrong');
        }
        return res;
      }, err => {
        this.toastr.error('Something Went Wrong');
      });
      this.loading = false;

      this.dialogRef.close('Submit');

      const leaveToUpdate = this.data.dataSource.find((element) => element.id == this.data.id);
    }

    this.cdr.detectChanges();
  } catch(error) {
  }
  cancle() {
    this.dialogRef.close("Cancel")
  }

}
