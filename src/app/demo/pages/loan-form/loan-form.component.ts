import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastType } from '../../models/models';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { MatNativeDateModule } from '@angular/material/core';

export enum LoanStatus {
  InProcess = 0,
  Approve = 1,
  Reject = 2,
  Close = 3
}
@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatFormFieldModule, MatProgressSpinnerModule, MaterialModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent implements OnInit {

  loanForm: FormGroup;
  loanId: string = '';
  loading: boolean = false;
  submitted: boolean;
  personData = [];
  @Input() public set employeeLoanId(id: string) {
    this._employeeLoanId = id;
    this.loanId = this.activeRoute.snapshot.params['id'] ?? '';
    this._isProfile = true;
    this.getLoanFormControl['personId'].disable();
    if (id) {
      this._commonService.get(`EmployeeLoan/${id}`).subscribe(res => {
        this.getLoanFormControl['personId'].setValue(id);
        this.loanForm.patchValue(res?.value);
      })
    }
    else if (this.loanId) {
      this.getLoanFormControl['personId'].setValue(this.loanId);
    } 
    else {
      this.getLoanFormControl['personId'].setValue(JSON.parse(localStorage.getItem('userInfo')).personID);
    }
  }

  public get employeeLoanId(): string {
    return this._employeeLoanId;
  }

  private _employeeLoanId!: string;
  isSubmitting : boolean = false

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.getLoanFormControl['personId'].setValue(JSON.parse(localStorage.getItem('userInfo')).personID);
      this.getLoanFormControl['personId'].disable();
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;
  @Output() onLoanAction: EventEmitter<boolean> = new EventEmitter();

  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private _commonService: CommonService, private datePipe: DatePipe) {
    this.loanForm = this.buildForm();
    this.submitted = false;
  }

  buildForm() {
    return this._fb.group({
      personId: ['', [Validators.required]],
      loanAmount: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      loanTenure: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      monthlyAmount: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]], 
      reason: ["", [Validators.required]],
      isActive: [LoanStatus.InProcess]
    })
  }

  public get getLoanFormControl() {
    return this.loanForm.controls
  }

  ngOnInit() {
    this._commonService.get(`Person`).subscribe(res => {
      this.personData = res;
    }) 
    this.deductionChanges();
  }

  calculateEndDate() {
    const loanTenure = Number(this.loanForm.get('loanTenure').value);
    const startDate = new Date(this.loanForm.get('startDate').value);
  
    if (loanTenure > 0 && !isNaN(startDate.getTime())) {
      const endDate = new Date(startDate);
      const monthsToAdd = Math.floor(loanTenure);
      const fractionalPart = loanTenure - monthsToAdd;
      endDate.setMonth(startDate.getMonth() + monthsToAdd);
  
      const daysToAdd = Math.round(fractionalPart * 30); 
      endDate.setDate(endDate.getDate() + daysToAdd);
  
      this.loanForm.get('endDate').setValue(endDate.toISOString().split('T')[0]);
    }
  }

  deductionChanges() {
    this.loanForm.get('loanAmount').valueChanges.subscribe(() => {
      this.calculateMonthlyDeduction();
    });

    this.loanForm.get('loanTenure').valueChanges.subscribe(() => {
      this.calculateMonthlyDeduction();
    });
  }

  calculateMonthlyDeduction() {
    const loanAmount = this.loanForm.get('loanAmount').value;
    const loanTenure = this.loanForm.get('loanTenure').value;

    if (loanAmount && loanTenure) {
      const monthlyAmount = parseFloat(loanAmount) / parseFloat(loanTenure);
      if (!isNaN(monthlyAmount)) {
        this.loanForm.patchValue({
          monthlyAmount: monthlyAmount.toFixed(2)
        }, { emitEvent: false });
      }
    }
  }

  addLoan() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    this.submitted = true;
    if (this.loanForm.invalid) {
      this.loanForm.markAllAsTouched();
      return;
    } 

    if (this.isProfile && this.router.url.includes('/user-profile')) {
      this.getLoanFormControl['personId'].setValue(JSON.parse(localStorage.getItem('userInfo')).personID);
      this.getLoanFormControl['personId'].enable();
    }
    else{
      this.getLoanFormControl['personId'].setValue(this.loanId);
      this.getLoanFormControl['personId'].enable();
    }
    let payload = { ...this.loanForm.value, id: this._employeeLoanId  || this.employeeLoanId }
    this.loading = true;

    if (this._employeeLoanId  || this.employeeLoanId) {
      this._commonService.put(`EmployeeLoan`, payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res?.statusCode === 200) {
            this.employeeLoanId = '';
            this._commonService.showToast('Loan Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
            this.isSubmitting = false
          }
          if (this.isProfile) {
            this.onLoanAction.emit(true);
            this.loanForm.reset();
          } else {
            this.router.navigate(['employee-loan-details']);
          }
        },
        error: (err) => {
          this.loading = false;
          let errorMessage = 'Something Went Wrong';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          }
      
          this._commonService.showToast(errorMessage, ToastType.ERROR, ToastType.ERROR);
        }
      });
      
    }
    else {
      this._commonService.post(`EmployeeLoan`, this.loanForm.value).subscribe(res => {
        this.loading = false;
        this.employeeLoanId = '';
        this._commonService.showToast('Loan Saved Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        if (this.isProfile) {
          this.onLoanAction.emit(true)
          this.loanForm.reset();

        } else {
          this.router.navigate(['employee-loan-details'])
        }
      }, (err) => {
        this.loading = false;
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  onList() {
    if (this.isProfile) {
      this.onLoanAction.emit(false)
      this.loanForm.reset();
      this.employeeLoanId = null;

    } else {
      this.router.navigate(['employee-loan-details'])
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.loanForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
