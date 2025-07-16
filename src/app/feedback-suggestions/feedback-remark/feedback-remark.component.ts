import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/service/common/common.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-feedback-remark',
  templateUrl: './feedback-remark.component.html',
  styleUrls: ['./feedback-remark.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule,
    MatButtonModule,
    FormsModule, MatFormFieldModule,
    MatInputModule]
})
export class FeedbackRemarkComponent {
  remarkForm: FormGroup;
  isView?: boolean;
  constructor(public dialogRef: MatDialogRef<FeedbackRemarkComponent>,
    private _fb: FormBuilder, private apiService: ApiService,
    private api: CommonService, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date, id: string, Status: string, elementData: any }) {
    this.remarkForm = this._fb.group({
      remark: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }
  cancelPopup() {
    this.dialogRef.close(false);
  }

  async saveData() {
    if (this.remarkForm.invalid) {
      this.remarkForm.markAllAsTouched();
      return;
    }
    let obj = { 'id': this.data.id, 'remarks': this.remarkForm.get('remark').value }
    let result = await this.apiService.updateRemark(obj);
    if (result) {
      this.api.showToast('Remark Added Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
      this.dialogRef.close(true);
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.remarkForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
