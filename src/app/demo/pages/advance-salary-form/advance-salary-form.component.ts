import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-advance-salary-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './advance-salary-form.component.html',
  styleUrls: ['./advance-salary-form.component.scss']
})
export class AdvanceSalaryFormComponent {
  advanceForm: FormGroup;
  loanId: string = '';
  submitted: boolean;
  personData = [];
  @Input() public set employeeAdvanceId(id: string) {
    this._employeeAdvanceId = id;
    this.loanId = this.activeRoute.snapshot.params['id'] ?? '';
    this._isProfile = true; 
    if (id) {
      this._commonService.get(`Advance/${id}`).subscribe((res) => { 
        this.advanceForm.patchValue(res?.value);
      });
    } 
  }

  public get employeeAdvanceId(): string {
    return this._employeeAdvanceId;
  }

  private _employeeAdvanceId!: string;
  isSubmitting: boolean = false;

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) { 
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;
  @Output() onLoanAction: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService
  ) {
    this.advanceForm = this.buildForm();
    this.submitted = false;
  }

  buildForm() {
    return this._fb.group({ 
      amount: ['', [Validators.required, Validators.pattern(/^[1-9]\d*(\.\d+)?$/)]],
      reason: ['', [Validators.required]]
    });
  }
  public get getAdvanceFormControl() {
    return this.advanceForm.controls;
  }

  ngOnInit() {
    this._commonService.get(`Person`).subscribe((res) => {
      this.personData = res;
    });
  }

  submit() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.submitted = true;
    if (this.advanceForm.invalid) {
      this.advanceForm.markAllAsTouched();
      return;
    } 
    let payload = { ...this.advanceForm.value, id: this._employeeAdvanceId || this.employeeAdvanceId };

    if (this._employeeAdvanceId || this.employeeAdvanceId) { 
      this._commonService.put(`Advance`, payload).subscribe({
        next: (res) => {
          if (res?.statusCode === 200) {
            this.employeeAdvanceId = '';
            this._commonService.showToast('Advance Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
            this.isSubmitting = false;
          }
          if (this.isProfile) {
            this.onLoanAction.emit(true);
            this.advanceForm.reset();
          } else {
            this.router.navigate(['employee-loan-details']);
          }
        },
        error: (err) => {
          let errorMessage = 'Something Went Wrong';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          }

          this._commonService.showToast(errorMessage, ToastType.ERROR, ToastType.ERROR);
        }
      });
    } else {
      this._commonService.post(`Advance`, this.advanceForm.value).subscribe(
        (res) => {
          this._commonService.showToast('Advance Saved Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);

          this.onLoanAction.emit(true);
          this.advanceForm.reset();
          this.employeeAdvanceId = '';
          this.isSubmitting = false;
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
    this.isProfile = true;
  }

  onList() {
    if (this.isProfile) {
      this.onLoanAction.emit(false);
      this.advanceForm.reset();
      this.employeeAdvanceId = null;
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.advanceForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
