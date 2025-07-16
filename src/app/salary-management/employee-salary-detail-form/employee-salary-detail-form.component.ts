import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-employee-salary-detail-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './employee-salary-detail-form.component.html',
  styleUrls: ['./employee-salary-detail-form.component.scss']
})
export class EmployeeSalaryDetailFormComponent implements OnInit {

  salaryForm: FormGroup<any>;
  public isSubmitted: boolean;
  public requestId: string = '';
  public month: any;
  deductionList: any[] = [];
  earningList: any[] = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private api: CommonService, private route: ActivatedRoute,) {
    this.salaryForm = this.buidForm();
  }
  ngOnInit(): void {
    this.getRecordById();
  }

  buidForm() {
    return this.formBuilder.group({
      employeeCode: ['', ],
      employeeName: ['', ],
      annualCTC: ['',],
      actualSalary: ['', ],
      month: ['', ],
      paidSalary: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      cutLeave: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      carryForwardLeave: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
    })
  }

  public get getsalaryFormControl() {
    return this.salaryForm.controls;
  }

  getRecordById() {
    this.requestId = this.route.snapshot.params['id'] ?? '';

    this.route.params.subscribe(params => {
      this.month = params['month'];
    })

    this.api.get(`Payroll/salary/${this.requestId}/${this.month}`).subscribe(res => {
      this.salaryForm.patchValue(res);

      this.deductionList = Object.keys(res.deductions);
      this.deductionList.forEach(item => {
        this.salaryForm.addControl(item, this.formBuilder.control(res.deductions[item],[Validators.required,Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]))
      })

      this.earningList = Object.keys(res.earning);
      this.earningList.forEach(item => {
        this.salaryForm.addControl(item, this.formBuilder.control(res.earning[item],[Validators.required,Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]))
      })

      this.salaryForm.get('employeeCode').disable();
      this.salaryForm.get('employeeName').disable();
      this.salaryForm.get('annualCTC').disable();
      this.salaryForm.get('actualSalary').disable();
      this.salaryForm.get('month').disable();
    })
  }
  submit() {
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      return;
    }
    let payload = {
      ...this.salaryForm.value,
      EmployeeId: this.requestId,
      month: this.salaryForm?.get(`month`)?.value
    }
    if (this.requestId) {
      this.api.put(`Payroll`, payload).subscribe((res) => {
        if (res) {
          this.api.showToast('Salary details updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.router.navigate(['/employee-payroll-details'])
        }
      },
        (error) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        })
    }
  }

  cancel() {
      this.router.navigate(['/employee-payroll-details'])
  }
}
