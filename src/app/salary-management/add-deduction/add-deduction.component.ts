import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';

export interface deduction {
  OrganizationId: string,
  Name: string,
  CalucationType: number,
  CalculationAmount: number,
  IsActive: number,
  IsApplyRule: number,
  ConditionAmount: number,
  Condition: string,
  CreatedDate: string,
  CreatedBy: string
}

export enum IsApplyRule {
  false = 0,
  true = 1
}

export enum IsActive {
  false = 0,
  true = 1
}

@Component({
  selector: 'app-add-deduction',
  templateUrl: './add-deduction.component.html',
  styleUrls: ['./add-deduction.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule]
})
export class AddDeductionComponent implements OnInit {
  dedcutionForm: FormGroup;
  id: string = '';
  title: string = "Add Deduction";
  buttonName: string = "Save";
  isView: boolean;
  calucationtype: number;
  amount: string = '';
  percentage: string = '';
  submitted: boolean = false;
  deductionData: deduction;
  public Calucationvalue: any;
  Calculation: { value: number, key: string }[] = [
    { value: 0, key: "<" },
    { value: 1, key: ">" },
    { value: 2, key: "+" },
    { value: 3, key: "=" },
    { value: 4, key: "/" }
  ]

  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private api: CommonService) {
    this.dedcutionForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/),  Validators.pattern(/\S/)]],
      calucationType: ['', [Validators.required]],
      isActive: [IsActive.true, [Validators.required]],
      conditionAmount: [''],
      calculationAmount: [''],
      condition: [''],
      isApplyRule: [IsApplyRule.false]
    })
  }
  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getDeductionByid();

    //update project
    if (this.id) {
      this.title = "Update Deduction";
      this.buttonName = "Update";
    }
  }

  selectCalucationType(data: any) {
    this.calucationtype = data.value;
  }

  navigate() {
    this.router.navigateByUrl('/salary-components-details');
  }

  // Add and update deduction list
  async createDeduction() {
    if (this.dedcutionForm.invalid) {
      this.dedcutionForm.markAllAsTouched();
      this.submitted = true;
      return;
    }
    if (this.calucationtype == 0) {
      if (this.dedcutionForm.get('conditionAmount')?.value?.length == 0) {
        this.dedcutionForm.get('conditionAmount').setErrors({ 'required': true })
        return;
      }
    } else if (this.calucationtype == 1 || this.calucationtype == 2) {
      if (this.dedcutionForm.get('calculationAmount')?.value?.length == 0) {
        this.dedcutionForm.get('calculationAmount').setErrors({ 'required': true })
        return;
      }
    }

    const calucationtype = this.dedcutionForm.get('calucationType')?.value;

    if (calucationtype === '0' && this.dedcutionForm.get('amount')?.value.length === 0) {
      this.dedcutionForm.get('amount')?.setErrors({ 'required': true });
      return;
    } else if (calucationtype === '1' && this.dedcutionForm.get('percentage')?.value.length === 0) {
      this.dedcutionForm.get('percentage')?.setErrors({ 'required': true });
      return;
    }

    const payload = {
      id: this.id,
      organizationsId: localStorage.getItem('orgId'),
      name: this.dedcutionForm.get('name')?.value,
      calucationType: calucationtype,
      status: this.dedcutionForm.get('status')?.value,
      amount: calucationtype === '0' ? this.dedcutionForm.get('amount')?.value : null,
      percentage: calucationtype === '1' ? this.dedcutionForm.get('percentage')?.value : null,
    };

    if (this.id) {
      this.api.put('Deduction', payload).subscribe(res => {
        if (res) {
          this.api.showToast('Deduction updated successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    } else {
      this.api.post('Deduction', this.dedcutionForm.value).subscribe(res => {
        if (res.statuscode == 200) {
          this.api.showToast('Deduction added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
    this.dedcutionForm.reset();
    this.getDeductionData();
    this.navigate();
  }

  // get deduction
  getDeductionData() {
    this.api.get('Deduction').subscribe(res => { })
  }

  // get and set value into form
  getDeductionByid() {
    this.api.get(`Deduction/${this.id}`).subscribe(res => {
      this.dedcutionForm.patchValue(res?.value);
      this.calucationtype = res?.value?.calucationType;
    })
  }

  Calucation(data) {
    this.Calucationvalue = data.value;
  }
  trimNameOnBlur(controlName: string) {
    const control = this.dedcutionForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }


}
