import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { Designation } from 'src/app/service/common/common.model';

@Component({
  selector: 'app-appraisal-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './appraisal-form.component.html',
  styleUrls: ['./appraisal-form.component.scss']
})
export class AppraisalFormComponent implements OnInit {
  personList: any[] = [];
  appraisalForm: FormGroup;
  appraisalId: string = '';
  percentage: any;
  id: string = '';
  isSubmitting: boolean = false;
  Designation: Array<Designation> = [];
  deptId: string = '';
  PersonID: string = '';
  designationId: string = '';
  DepartmentName: any;
  DepartmentID: any;
  PersonName: any;

  constructor(
    private _fb: FormBuilder,
    private api: CommonService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService
  ) {
    this.appraisalForm = this.buildForm();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getAppraisalDataById();
    this.getAllDepartment();
    this.getAllperson();
    this.getFormFormControl['employeeId'].enable();

    this.appraisalForm.get('oldCTC').disable();
    this.appraisalForm.get('appraisalAmount').valueChanges.subscribe((appraisalAmount) => {
      this.calculatePercentage();
    });
  }

  buildForm() {
    return this._fb.group({
      employeeId: [''],
      DesignationId: [''],
      departmentId: [''],
      appraisalAmount: ['', Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)],
      oldCTC: ['']
    });
  }
  public get getFormFormControl() {
    return this.appraisalForm.controls;
  }

  onEmployeeChange(event: any): void {
    this._commonService.get(`Appraisal/CTC/${event.value}`).subscribe((res) => {
      this.appraisalForm.patchValue({ oldCTC: res?.ctc });
    });
  }

  calculatePercentage() {
    const oldCTCAmount = this.appraisalForm.get('oldCTC').value;
    const appraisalAmount = this.appraisalForm.get('appraisalAmount').value;
    if (oldCTCAmount > 0 && appraisalAmount >= 0) {
      this.percentage = ((appraisalAmount / oldCTCAmount) * 100).toFixed(2);
    } else {
      this.percentage = 0;
    }
  }

  getAppraisalDataById() {
    this.appraisalId = this.activeRoute.snapshot.params['id'] ?? '';
    if (this.appraisalId) {
      this._commonService.get(`Appraisal/${this.appraisalId}`).subscribe((res: any[]) => {
        this.appraisalForm.patchValue(res);
        this.calculatePercentage();
        this.appraisalForm.get('employeeId').disable();
      });
    }
  } 

  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? ''
    designationId = designationId ?? ''
     this.api.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
        this.personList = res.sort((a, b) => a.firstName.localeCompare(b.firstName)); 
      });
  }
  getAllDepartment() {
    this.api.get(`Department`).subscribe((x) => {
      this.DepartmentName = x;
    });
  }

  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.PersonID = '';
    this.Designation = [];
    this.PersonName = [];
    this.getAllperson(this.deptId, '');

    if (!this.deptId) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res: any) => {
      this.Designation = res;
    });

  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.PersonID = '';
    this.PersonName = [];

    if (!this.designationId) return;
 

    this.getAllperson('', this.designationId) ;

  }



  submit() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    if (this.appraisalForm.invalid) {
      this.appraisalForm.markAllAsTouched();
      return;
    }

    let payload = {
      employeeId: this.appraisalForm.get('employeeId').value,
      oldCTC: this.appraisalForm.get('oldCTC').value,
      ...this.appraisalForm.value
    };
    if (this.appraisalId) {
      payload = {
        id: this.appraisalId,
        ...payload
      };
      this._commonService.post(`Appraisal`, payload).subscribe(
        (res) => {
          this._commonService.showToast('Appraisal updated successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.router.navigate(['appraisal']);
          this.appraisalForm.reset();
        },
        (err) => {
          this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    } else {
      this.appraisalForm.get('oldCTC').value;
      this._commonService.post(`Appraisal`, payload).subscribe(
        (res) => {
          this._commonService.showToast('Appraisal added successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.router.navigate(['appraisal']);
          this.appraisalForm.reset();
        },
        (err) => {
          this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  onList() {
    this.router.navigate(['appraisal']);
  }
}
