import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastType } from 'src/app/demo/models/models';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

export interface earning {
  OrganizationId: string,
  Name: string,
  CalucationType: number,
  CalculationAmount: number,
  ConditionAmount: number,
  Condition: string,
  CreatedDate: string,
  CreatedBy: string
}

@Component({
  selector: 'app-add-bonus',
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
    MatRadioModule],
  templateUrl: './add-bonus.component.html',
  styleUrls: ['./add-bonus.component.scss']
})
export class AddBonusComponent {

  isCheked: boolean = false
  bonusForm: FormGroup;
  id: string = '';
  title: string = "Add";
  buttonName: string = "Save";
  isView: boolean;
  calucationtype: number;
  amount: string = '';
  percentage: string = '';
  selectedDepartment: any = '';
  selectedDesignation: any = '';
  selectedPersonId: any = '';
  public searchDataValue = '';

  payrollLabel: string = 'Bonus';
  selectedOption: string = 'earning'
  submitted: boolean = false;
  earningData: earning;
  calucationTypeData: any
  Calucationvalue: any;
  isSubmitting: boolean = false;
  public isAllSelected = false;
  initChecked = true;

  public departmentList: any[] = [];
  public designationList: any[] = [];
  public employeeList: any[] = [];
  public filteredEmployee: any[] = [];
  public tableData: any[] = [];

  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private _commonService: CommonService, private sweetlalert: SweetalertService) {
    this.bonusForm = this._fb.group({
      title: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      calculationType: ['', [Validators.required]],
      amount: [''],
      status: [1],
      remarks: [''], 
    })
  }
  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';

    //update project
    if (this.id) {
      this.title = "Update";
      this.buttonName = "Update";
      this.getByIdData() 
    }
    this.getAllDepartment();
    this.getAllEmployee();
  }

  getByIdData() {
    this._commonService.get(`Bonus/GetByBonusId?id=${this.id}`).subscribe((x) => {
      this.bonusForm.patchValue(x);

      this.selectedPersonId = x.personId;

      this.calucationtype = x.calculationType;
      this.bonusForm.get('status').setValue(x.status); 
    })
  }

  getAllDepartment() {
    this._commonService.get(`Department`).subscribe(res => {
      this.departmentList = res;
    })
  }
  onDepartmentChange(event: any) {
    const selectedValues = event ?? '';
    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${selectedValues}`).subscribe(res => {
      this.designationList = res;
    })

    this.getAllEmployee(selectedValues, '');
  }
  
  onDesignationChange(event: any) {
    this.initChecked = true;
    const selectedValues = event ?? '';

    this.getAllEmployee('', selectedValues);
  }

  getAllEmployee(departmentID?: string, designationID?: string) {
    departmentID = departmentID ?? '';
    designationID = designationID ?? '';
    this._commonService.get(`person/employees?departmentId=${departmentID}&designationId=${designationID}`).subscribe(res => {
      if (res?.length)
        res?.map((x: any) => x.isSelected = true);
      this.filteredEmployee = res;
       this.tableData = res;
    })
  }

  selectAll(initChecked: boolean) {
    if (initChecked) {
      this.filteredEmployee.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.filteredEmployee.forEach((f) => {
        f.isSelected = false;
      });
    }
  }

  toggle() {
    const currentValue = this.bonusForm.get('status').value;
    const newValue = currentValue === 0 ? 1 : 0;
    this.bonusForm.get('status').setValue(newValue);
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

    this.router.navigateByUrl('/bonus-master-list');
  }

   public searchData(value: string): void {
    if (value === '') {
      this.filteredEmployee = this.tableData;
    } else {
      this.filteredEmployee = this.tableData.filter(item => {
        return (item?.firstName + " " + item?.lastName).toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }
  async createEarning() {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true
    if (this.bonusForm.invalid) {
      this.bonusForm.markAllAsTouched();
      this.submitted = true;
      return;
    }

    let selectedIds = this.filteredEmployee
      .filter(emp => emp.isSelected)
      .map(emp => emp.id);

    let payload = {
      ...this.bonusForm.value
    }

    if (this.id) {

      payload = {
        ...this.bonusForm.value,
        id: this.id,
        personId: this.selectedPersonId,
      }

      this._commonService.put(`Bonus/Update`, payload).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Bonus updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.router.navigate(['bonus-master-list'])
          this.isSubmitting = false
        }
      }, err => {
        this._commonService.showToast('Something Went Wrong.', ToastType.ERROR, ToastType.ERROR)
      })

    } else {
      payload = {
        ...this.bonusForm.value,
        personIds: selectedIds,
      }
      this._commonService.post(`Bonus/ADD`, payload).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Bonus added sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.router.navigate(['bonus-master-list'])
          this.isSubmitting = false
        }
      }, err => {
        this._commonService.showToast('Something Went Wrong.', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.bonusForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}