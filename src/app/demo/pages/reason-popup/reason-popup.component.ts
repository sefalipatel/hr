import { ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-reason-popup',
  standalone: true,
  templateUrl: './reason-popup.component.html',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, CommonModule],
  styleUrls: ['./reason-popup.component.scss']
})
export default class ReasonPopupComponent {
  personId: { personID: string }
  form: FormGroup;
  loading: boolean = false
  constructor(private cdr: ChangeDetectorRef, private toastr: ToastrService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReasonPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date, id: string, requestid: string, dataSource }) {
    this.form = this.formBuilder.group({
      id: "",
      PersonId: '',
      Approval: 2,
      ApprovedBy: JSON.parse(localStorage.getItem('userInfo')).personID,
      ApprovedOn: '',
      Reason: '',
      RejectionReason: ''
    })
  }

  async Reject() {
    this.form.get("id").setValue(this.data.dataSource.id);
    this.form.get("PersonId").setValue(this.data.dataSource.personId)
    this.loading = true;
    const response = await this.apiService.rejectStatus(this.form.value);
    this.loading = false;
    response ? this.toastr.success('Leave successfully rejected') : '' 
    this.dialogRef.close('Submit');
    // Update the status and remarks in the table
    const leaveToUpdate = this.data.dataSource.find((element) => element.id == this.data.id); 

    this.cdr.detectChanges();
  } catch(error) {
  }
  cancle() {
    this.dialogRef.close("Cancel")
  }
  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
  }

}
