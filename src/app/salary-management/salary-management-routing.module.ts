import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryManagementComponent } from './salary-management.component';
import { DeductionComponent } from './deduction/deduction.component';
import { AddEarningComponent } from './add-earning/add-earning.component';
import { SalaryEarningComponent } from './salary-earning/salary-earning.component';
import { AddDeductionComponent } from './add-deduction/add-deduction.component';
import { PayrollComponentFormComponent } from './payroll-component-form/payroll-component-form.component';

const routes: Routes = [ 
  { path: '', component: SalaryEarningComponent },
  { path: ':id', component: SalaryEarningComponent },
  { path: 'deduction', component: DeductionComponent },
  { path: 'add-earning-component/:mode', component: PayrollComponentFormComponent },
  { path: 'add-deduction-component/:mode', component: PayrollComponentFormComponent },
  { path: 'add-earning-component/:mode/:id', component: PayrollComponentFormComponent },
  { path: 'add-deduction-component/:mode/:id', component: PayrollComponentFormComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryManagementRoutingModule { }
