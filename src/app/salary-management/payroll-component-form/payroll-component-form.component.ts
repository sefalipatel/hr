import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { Designation } from 'src/app/service/common/common.model';

export interface Payroll {
  id: string;
  name: string;
  calucationtype: string;
  status: string;
  departmentId: string;
}

export enum IsActive {
  false = 0,
  true = 1
}

export enum IsApplyRule {
  false = 0,
  true = 1
}

@Component({
  selector: 'app-payroll-component-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './payroll-component-form.component.html',
  styleUrls: ['./payroll-component-form.component.scss']
})
export class PayrollComponentFormComponent implements OnInit {
  Calculation: { value: number, key: string }[] = [
    { value: 0, key: "<" },
    { value: 1, key: ">" },
    { value: 2, key: "+" },
    { value: 3, key: "=" },
    { value: 4, key: "/" }, 
  ]
  isCheked: boolean = false
  earningForm: FormGroup;
  id: string = '';
  title: string = "Add";
  buttonName: string = "Save";
  isView: boolean;
  calculationType: number;
  amount: string = '';
  percentage: string = '';
  payrollLabel: string = 'Earning';
  selectedOption: string = 'earning'
  submitted: boolean = false;
  earningData: Payroll;
  calculationValue: any;
  isSubmitting : boolean = false;
  designationId: string = '';
  deptId: string = '';
  DepartmentName: any;
  DepartmentID: any;
  Designation: Array<Designation> = [];

  constructor(private _fb: UntypedFormBuilder, private router: Router, private activeRoute: ActivatedRoute, private apiService: ApiService, private api: CommonService) {
    this.earningForm = this._fb.group({
      departmentId: ['',[Validators.required]],
      designationId: ['',[Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      calculationType: [''],
      isActive: [IsActive.true],
      condition: [''],
      conditionAmount: [''],
      calculationAmount: [''],
      isApplyRule: [IsApplyRule.false]
    })
    this.payrollLabel = this.router.url?.includes('add-earning-component') ? 'Earning' : 'Deduction';
    this.getAllDepartment();
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    //update project
    if (this.id) {
      this.title = "Update";
      this.buttonName = "Update"; 
      this.api.get(`${this.payrollLabel}/${this.id}`).subscribe(data => {
        this.earningData = data.value;
        if(this.earningData.departmentId != null)
          this.getDesignation(this.earningData.departmentId);
        this.earningForm.patchValue(this.earningData);
        this.calculationType = data.value.calculationType;
      })
    }
  }

  onRadioButtonChange() {
    if (this.selectedOption === 'earning') {
      this.payrollLabel = 'Earning';
    } else if (this.selectedOption === 'deduction') {
      this.payrollLabel = 'Deduction';
    }
  }

  getAllDepartment() {
    this.api.get(`Department`).subscribe((x) => {
      this.DepartmentName = x;
    });
  }

  //  When department is selected → fetch designations
  onDepartmentChange(event: any) {
    this.getDesignation(event.value);
  }

  getDesignation(DepartmentID){
    this.Designation = [];
    this.api.get(`Designation/DesignationByDepartmentId?departmentId=${DepartmentID}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  selectCalculationType(data: any) {
    this.calculationType = data.value;
  }
  Calucation(data) {
    this.calculationValue = data.value
  }
  navigate() {
    this.router.navigate(['salary-components-details'], { queryParams: { type: this.payrollLabel } })
  }

  createEarning() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.earningForm.invalid) {
      this.earningForm.markAllAsTouched();
      this.submitted = true;
      return;
    } 

    if (this.id == '') { 
      let obj = { 'organizationsId': localStorage.getItem('orgId'), ...this.earningForm.value }
       this.api.post(`${this.payrollLabel}`, obj).subscribe(result => {
        if (result.statusCode === 200) {
          this.api.showToast(`${this.payrollLabel === 'Earning' ? 'Earning' : 'Deduction'} Added Successfully.`, ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false
          this.navigate();
          this.earningForm.reset()
        }
      })

    } else { 
      let obj = { 'organizationsId': localStorage.getItem('orgId'), 'id': this.id, ...this.earningForm.value }
      this.api.put(`${this.payrollLabel}`, obj).subscribe(result => {
        if (result.statusCode === 200) {
          this.api.showToast(`${this.payrollLabel === 'Earning' ? 'Earning' : 'Deduction'} Update Successfully.`, ToastType.SUCCESS, ToastType.SUCCESS);
          this.navigate();
          this.earningForm.reset()
        }
      })
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.earningForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

}
