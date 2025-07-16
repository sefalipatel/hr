import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userRole } from 'src/app/assets.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';

enum InsuranceType {
  MedicalInsurance = 0,
  LifeInsurance = 1
}
@Component({
  selector: 'app-employee-personal-insurance-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './employee-personal-insurance-form.component.html',
  styleUrls: ['./employee-personal-insurance-form.component.scss']
})
export class EmployeePersonalInsuranceFormComponent implements OnInit {
  public employeePersonalInsuranceForm: FormGroup;
  employeeInsuranceId: string = ''
  public userRole: Array<userRole> = [];
  id: string = '';
  isSubmitting : boolean = false
  public insuranceTypeList = [
    {
      name: 'Medical Insurance',
      value: InsuranceType.MedicalInsurance
    },
    {
      name: 'Life Insurance',
      value: InsuranceType.LifeInsurance
    }
  ];
  @Output() onInsuranceList: EventEmitter<boolean> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,private activeRoute: ActivatedRoute,  private router: Router, private _commonService: CommonService) {
    this.employeePersonalInsuranceForm = this.buildForm();
  }
  
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
  }

  buildForm() {
    return this.formBuilder.group({
      companyName: ["", ],
      planName: ["", ],
      coverAmount: ["", [Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      insuranceType: ["", ],
      personId: [JSON.parse(localStorage.getItem('userInfo')).personID, ]
    })
  }
  get empInsFormControl() {
    return this.employeePersonalInsuranceForm.controls;
  }

  onList() {
    this.onInsuranceList.emit(false);
  }

  addEmployeeInsurance() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    let isFormValid = true;
    if (this.employeePersonalInsuranceForm.invalid) {
      this.employeePersonalInsuranceForm.markAllAsTouched();
      return;
    }


    // Trim all form values before checking validity
    Object.keys(this.employeePersonalInsuranceForm.controls).forEach((key) => {
      const control = this.employeePersonalInsuranceForm.get(key);
      if (control && typeof control.value === 'string') {
        const trimmedValue = control.value.trim();
        control.setValue(trimmedValue, { emitEvent: false });

        // If any field becomes empty after trimming, mark form as invalid
        if (trimmedValue === '') {
          isFormValid = false;
        }
      }
    });
      // Prevent form submission if any field is empty after trimming
      if (!isFormValid) {
        this.employeePersonalInsuranceForm.markAllAsTouched();
        return;
      }
    this._commonService.post('EmployeePersonalInsurance', this.employeePersonalInsuranceForm.value).subscribe(res => {
      if (res) {
        this.onInsuranceList.emit(true);
        this._commonService.showToast('Employee insurance added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
      }
    })
    this.employeePersonalInsuranceForm.reset();
  }

  trimNameOnBlur(controlName: string) {
    const control = this.employeePersonalInsuranceForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
