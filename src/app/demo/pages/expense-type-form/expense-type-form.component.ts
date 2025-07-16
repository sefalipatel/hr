import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-expense-type-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './expense-type-form.component.html',
  styleUrls: ['./expense-type-form.component.scss']
})
export class ExpenseTypeFormComponent implements OnInit {
  
  public expenseTypeForm: FormGroup;
  public expenseId: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private _commonService: CommonService, private datePipe:DatePipe) {
    this.expenseTypeForm = this.buildForm();
  }
  ngOnInit(): void {
    this.getFormValue();
  }

  buildForm() {
    return this.formBuilder.group({
      typeName: ["", [Validators.required]],
    })
  }

  get expenseTypeFormControl() {
    return this.expenseTypeForm.controls;
  }

  getFormValue() {
    this.route.params.subscribe(async (params) => {
      this.expenseId = params['id'];
    });
    if (this.expenseId) {
      this._commonService.get(`ExpenseType/${this.expenseId}`).subscribe(res => {
        this.expenseTypeForm.patchValue(res?.value);
      })
    }
  }

  addExpenseType() {
    if (this.expenseTypeForm.invalid || !this.expenseTypeForm.dirty) {
      this.expenseTypeForm.markAllAsTouched();
      return;
    }
    
    if (this.expenseId) {
      const payload = {
        ...this.expenseTypeForm.value,
        id: this.expenseId
      }
    
      this._commonService.put(`ExpenseType`, payload).subscribe(res => {
        if (res) {
          this.router.navigate(['expense-type-list']);
          this._commonService.showToast('Expense type updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    } else {
      this._commonService.post('ExpenseType', this.expenseTypeForm.value).subscribe(res => {
        if (res) {
          this.router.navigate(['expense-type-list']);
          this._commonService.showToast('Expense type added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
    this.expenseTypeForm.reset();
  }

  onList() {
    this.router.navigate(['expense-type-list']);
  }

  trimNameOnBlur(controlName: string) {
    const control = this.expenseTypeForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
