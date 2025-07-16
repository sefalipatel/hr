import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ToastType } from 'src/app/demo/models/models';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { InsurancePerson, userRole } from 'src/app/assets.model';
import { ApiService } from '../api.service';
@Component({
  selector: 'app-warning-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, MaterialModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './warning-form.component.html',
  styleUrls: ['./warning-form.component.scss']
})
export class WarningFormComponent {
  public warningForm: FormGroup;
  public insuranceCompany: InsurancePerson[];
  public getAllEmplyeeList: InsurancePerson[];
  public userRole: Array<userRole> = [];
  companypolicytypeList: any[] = [];
  companypolicyList: any[] = [];
  isVerified: boolean = true;
  isButtonVisible = true;
  isSubmitted: boolean;
  Companypolicylist: any;
  id: string = '';
  @Input() public set employeeInsuranceId(id: string) {
    this._employeeInsuranceId = id;
    if (id) {
    }
  }

  public get employeeInsuranceId(): string {
    return this._employeeInsuranceId;
  }

  private _employeeInsuranceId!: string;

  constructor(private formBuilder: FormBuilder, private route:
    ActivatedRoute, private router: Router, private _commonService: CommonService,  private activeRoute: ActivatedRoute,
    private datePipe: DatePipe, private apiService: ApiService,) {
    this.warningForm = this.buildForm();
    this.isSubmitted = false;
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getAllWarningPerson();
    this.getAllCompanypolicylist();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "UserProfile";
      })
    }
  }

  buildForm() {
    return this.formBuilder.group({
      Comment: ["", [Validators.required,]],
      companypolicyId: ["", Validators.required],
      EmployeeId: ["", Validators.required],

    })
  }

  get warningFormControl() {
    return this.warningForm.controls;
  }

  onList() {
    this.router.navigate(['warning']);
  }
  onPolicyTypeselect(type) {
    this.companypolicyList = this.companypolicytypeList?.find((x) => x.id == type?.value).companyPolicy
  }

  getAllCompanypolicylist() {
    this._commonService.get(`CompanyPolicy/listcompanypolicy`).subscribe(res => {
      this.Companypolicylist = res;
    })
  }

  getAllWarningPerson() {
    this._commonService.get(`Person/listemployee`).subscribe(res => {
      this.getAllEmplyeeList = res;
      this.getAllEmplyeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }

  onSubmit() {
    if (this.warningForm.invalid || !this.isVerified) {
      this.warningForm.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }
    this._commonService.post(`Warning`, this.warningForm.value).subscribe(data => {
      if (data?.statusCode == 200) {
        this._commonService.showToast('Warning Added Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.router.navigate(['/warning']);
      } else {
        this._commonService.showToast(data?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })

  }

  trimNameOnBlur(controlName: string) {
    const control = this.warningForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

}
