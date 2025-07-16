import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ToastType } from '../../models/models';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { InsurancePerson, userRole } from 'src/app/assets.model';
@Component({
  selector: 'app-employee-insurance-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, MaterialModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './employee-insurance-form.component.html',
  styleUrls: ['./employee-insurance-form.component.scss']
})
export class EmployeeInsuranceFormComponent implements OnInit {
  public employeeInsuranceForm: FormGroup;
  public insuranceCompany: InsurancePerson[];
  public getAllEmplyeeList: InsurancePerson[];
  public userRole: Array<userRole> = [];
  id: string = '';
  maxDate: Date;

  @Input() public set employeeInsuranceId(id: string) {
    this._employeeInsuranceId = id;
    if (id) { 
    }
  }

  public get employeeInsuranceId(): string {
    return this._employeeInsuranceId;
  }

  private _employeeInsuranceId!: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private activeRoute: ActivatedRoute, private router: Router, private _commonService: CommonService, private datePipe: DatePipe) {
    this.employeeInsuranceForm = this.buildForm();
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getAllInsuranceCompanyList();
    this.getAllEmployeePerson();
    this.getFormValue();

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "UserProfile";
      })
    }
  }

  // get all insurance company list
  getAllInsuranceCompanyList() {
    this._commonService.get('Insurance').subscribe(res => {
      this.insuranceCompany = res;
    })
  }

  // get and set value into the form
  getFormValue() {
    this.route.params.subscribe(async (params) => {
      this.employeeInsuranceId = params['id'];
    });
    if (this.employeeInsuranceId) {
      this._commonService.get(`EmployeeInsurance/${this.employeeInsuranceId}`).subscribe(res => {
        this.employeeInsuranceForm.patchValue(res?.value);
        this.employeeInsuranceForm.get('personsId').setValue(res?.value?.personId);
      })
    }
  }

  buildForm() {
    return this.formBuilder.group({
      amount: ["", [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      insuranceId: ["", Validators.required],
      startDate: ["", Validators.required],
      personsId: ["", Validators.required]
    })
  }

  get empInsuranceFormControl() {
    return this.employeeInsuranceForm.controls;
  }

  // redirect to employee insurance list click on "cancel" and "<" button
  onList() {
    this.router.navigate(['employee-insurance-details']);
  }

  // Add and update function
  addEmployeeinsurance() {
    if (this.employeeInsuranceForm.invalid) {
      this.employeeInsuranceForm.markAllAsTouched();
      return;
    }
    const formattedDate = this.datePipe.transform(this.employeeInsuranceForm.value.startDate, 'yyyy-MM-ddTHH:mm:ss');
    this.employeeInsuranceForm.patchValue({ startDate: formattedDate });

    const payload = {
      ...this.employeeInsuranceForm.value,
      id: this.employeeInsuranceId
    }
    if (this.employeeInsuranceId) {
      this._commonService.put(`EmployeeInsurance`, payload).subscribe(res => {
        if (res) {
          this.getEmployeeInsuranceList();
          this.router.navigate(['employee-insurance-details']);
          this._commonService.showToast('Employee insurance has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      })
    } else {
      this._commonService.post('EmployeeInsurance', this.employeeInsuranceForm.value).subscribe(res => {
        if (res) {
          this.getEmployeeInsuranceList();
          this.router.navigate(['employee-insurance-details']);
          this._commonService.showToast('Employee insurance added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      })
    }
    this.employeeInsuranceForm.reset();
  }

  // get all employee insurance list
  getEmployeeInsuranceList() {
    this._commonService.get('EmployeeInsurance').subscribe(res => {
    });
  }

  // get all employee person
  getAllEmployeePerson() {
    this._commonService.get('Person').subscribe(res => {
      this.getAllEmplyeeList = res;
      this.getAllEmplyeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }

}
