import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
export interface earning {
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

export enum IsActive {
  false = 0,
  true = 1
}

export enum IsApplyRule {
  false = 0,
  true = 1
}
@Component({
  selector: 'app-add-earning',
  templateUrl: './add-earning.component.html',
  styleUrls: ['./add-earning.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule, MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule, MatCheckboxModule,
    MatRadioModule]
})
export class AddEarningComponent implements OnInit {
  Calculation: { value: number, key: string }[] = [
    { value: 0, key: "<" },
    { value: 1, key: ">" },
    { value: 2, key: "+" },
    { value: 3, key: "=" },
    { value: 4, key: "/" },
    // { value: 5, key: "OnDuty Leave" },
    // { value: 6, key: "Event Leave" },
    // { value: 7, key: "Comp Off" },
  ]
  isCheked: boolean = false
  earningForm: FormGroup;
  id: string = '';
  title: string = "Add";
  buttonName: string = "Save";
  isView: boolean;
  calucationtype: number;
  amount: string = '';
  percentage: string = '';
  payrollLabel: string = 'Earning';
  selectedOption: string = 'earning'
  submitted: boolean = false;
  earningData: earning;
  calucationTypeData: any
  Calucationvalue: any;

  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private apiService: ApiService, private api: CommonService) {
    this.earningForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      calucationType: ['', [Validators.required]],
      isActive: [IsActive.true, [Validators.required]],
      condition: [''],
      conditionAmount: [''],
      calculationAmount: [''],
      isApplyRule: [IsApplyRule.false]
    })
  }
  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';

    //update project
    if (this.id) {
      this.title = "Update";
      this.buttonName = "Update";
      let data = await this.apiService.getEarningId(this.id);
      this.earningData = data.value;
      this.earningForm.patchValue(this.earningData);
      this.calucationtype = data.value.calucationType;
    }
  }

  onRadioButtonChange() {
    if (this.selectedOption === 'earning') {
      this.payrollLabel = 'Earning';
    } else if (this.selectedOption === 'deduction') {
      this.payrollLabel = 'Deduction';
    }
  }

  selectCalucationType(data: any) {
    this.calucationtype = data.value;
  }
  Calucation(data) {
    this.Calucationvalue = data.value
  }
  navigate() {
    this.router.navigateByUrl('/salary-components-details');
  }

  async createEarning() {
    let isFormValid = true;
    // Trim all form values before checking validity
    Object.keys(this.earningForm.controls).forEach((key) => {
      const control = this.earningForm.get(key);
      if (control && typeof control.value === 'string') {
        const trimmedValue = control.value.trim();
        control.setValue(trimmedValue, { emitEvent: false });

        // If any field becomes empty after trimming, mark form as invalid
        if (trimmedValue === '') {
          isFormValid = false;
        }
      }
    });
    if (!isFormValid || this.earningForm.invalid) {
      this.earningForm.markAllAsTouched();
      this.submitted = true;
      return;
    }
    if (this.calucationtype == 0) {
      if (this.earningForm.get('conditionAmount').value.length == 0) {
        this.earningForm.get('conditionAmount').setErrors({ 'required': true })
        return;
      }
    } else if (this.calucationtype == 1 || this.calucationtype == 2) {
      if (this.earningForm.get('calculationAmount').value.length == 0) {
        this.earningForm.get('calculationAmount').setErrors({ 'required': true })
        return;
      }
    }

    if (this.id == '') {
      if (this.calucationtype == 2) {
        this.earningForm.removeControl('ConditionAmount')
      }
      let obj = { 'organizationsId': localStorage.getItem('orgId'), ...this.earningForm.value }
      let result = await this.apiService.addEarning(obj);
      if (result.statusCode === 200) {
        this.api.showToast('Earning Added Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        this.router.navigate(['salary-components-details'])
        this.earningForm.reset()
      }

    } else {
      if (this.calucationtype == 2) {
        this.earningForm.removeControl('ConditionAmount')
      }
      let obj = { 'organizationsId': localStorage.getItem('orgId'), 'id': this.id, ...this.earningForm.value }
      let result = await this.apiService.updateEarning(obj);
      if (result.statusCode === 200) {
        this.api.showToast('Earning updated Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        this.router.navigate(['salary-components-details'])
        this.earningForm.reset()
      }
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
