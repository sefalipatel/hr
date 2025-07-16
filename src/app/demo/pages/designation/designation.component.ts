import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { CommonService } from 'src/app/service/common/common.service';
import { Department, Designation, ToastType } from 'src/app/service/common/common.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SweetalertService } from '../role-list/sweetalert.service';
import { Router } from '@angular/router';
import { userRole } from 'src/app/assets.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

enum designationEnum {
  departmentName = 'departmentName',
  name = 'name',
  description = 'description',
  level = 'level',
  isActive = 'isActive',
  actions = 'actions'
}
@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSlideToggleModule
  ],
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {
  public designationForm: FormGroup;
  public isDesignationAdd: boolean = false;
  public designationId: string = '';
  public tableData: Array<Designation> = [];
  Department: Array<Department> = [];
  public searchDataValue = '';
  public sortConfig!: Sort;
  public searchTerm: string = '';
  public designationList: Designation[] = [];
  public resetCurrentPage: boolean = false;
  public getDesignationId: string;
  public userRole: Array<userRole> = [];
  public loading: boolean = false;
  public isDesignationTitle: boolean = false;
  isSubmitting: boolean = false;
  DepartmentName: any;
  departmentId: any;

  dataSource = new MatTableDataSource<Designation>();
  displayedColumns: string[] = Object.values(designationEnum);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    private api: CommonService
  ) {
    this.designationForm = this.buildForm();
  }

  ngOnInit(): void {
    this.getAllDesignation();
    this.getAllDepartment();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'Designation';
      });
    }
    this.api.get(`Department`).subscribe((response) => {
      this.Department = response;
    });
  }

  buildForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      departmentId: ['', Validators.required],
      description: ['', Validators.required],
      level: ['', Validators.required],
      isActive: [true]
    });
  }

  // form control
  get designationFormControl() {
    return this.designationForm.controls;
  }

  // open designation form
  addDesignation() {
    this.isDesignationAdd = true;
    this.designationId = '';
    this.isDesignationTitle = true;
  }

  getEarningDeducation(designationId: string){
    this.router.navigate(['/salary-components-details'], {
      queryParams: { designationId: designationId }
    });
  }

  // add and update of designation on click save button
  saveDesignation() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }
    let payload = {
      organizationId: localStorage.getItem('orgId'),
      ...this.designationForm.value,
      isActive: this.designationForm.value.isActive ?? false
    };

    if (this.getDesignationId) {
      let updatePayload = {
        id: this.getDesignationId,
        ...payload
      };
      this._commonService.put('Designation', updatePayload).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Designation updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.designationForm.reset();
          this.getAllDesignation();

          // this.tableData[this.designationIndex] = res;
        }
      });
    } else {
      this._commonService.post('Designation', payload).subscribe((res) => {
        this._commonService.showToast('Designation added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false;
        this.designationForm.reset();
        this.getAllDesignation();
      });
    }
  }

  // close form on click of cancel button
  resetForm() {
    this.designationForm.reset();
    this.isDesignationAdd = false;
    this.designationId = '';
  }

  // Set value into form on edit
  editDesignation(element) {
    this.isDesignationAdd = true;
    this._commonService.get('Designation' + `/${element.id}`).subscribe((res) => {
      this.getDesignationId = res?.id;
      this.designationForm.patchValue(res);
    });
    this.isDesignationTitle = false;
    this.designationId = '';
  }

  // Delete designation
  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete('Designation' + `/${element.id}`).subscribe(
        (res) => {
          if (res?.statusCode == 200 || !res) {
            this._commonService.showToast('Designation deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
            this.getAllDesignation();
          } else if (res?.statusCode == 400 || !res) {
            this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR);
          }
        },
        (err) => {
          this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  // search function
  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        return item?.name.toLowerCase().includes(value.toLowerCase()) || item?.description.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

  // Toggle switch update
  switchToggle(id: string, isActive: boolean) {
    this._commonService.put(`Designation/${id}/active/${isActive}`, '').subscribe((res) => {
      this.getAllDesignation();
    });
  }
  getAllDepartment() {
    this.api.get(`Department`).subscribe((x) => {
      this.DepartmentName = x;
    });
  }
  getAllDesignation() {
    this.loading = true;
    this._commonService.get('Designation').subscribe((res) => {
      this.loading = false;
      this.tableData = res;
      this.dataSource = new MatTableDataSource<Designation>(this.tableData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    });
  }
  trimNameOnBlur(controlName: string) {
    const control = this.designationForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  getDepartmentName(departmentId: string): string {
    const department = this.Department.find((d) => d.id === departmentId);
    return department ? department.departmentName : '-';
  }
}
