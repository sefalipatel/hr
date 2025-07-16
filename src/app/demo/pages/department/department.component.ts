import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { Department } from 'src/app/service/common/common.model';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatSort } from '@angular/material/sort';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, SharedModule, MatPaginatorModule, MatTableModule],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  departmentId: string = '';
  isDepartmentAdd: boolean = false;
  isDepartmentTitle: boolean = false;
  isSubmitting: boolean = false;
  DepartmentName: any;
  personList: any[] = [];
  dataSource = new MatTableDataSource<Department>();
  displayedColumns: string[] = ['departmentName', 'departmentHead', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private _commonService: CommonService,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private router: Router
  ) {
    this.departmentForm = this.fb.group({ 
      departmentName: ['', Validators.required],
      departmentHead: ['']
    });
  }
  ngOnInit(): void {
    this.getAllDepartment();
    this.getAllPerson();
  }

  getAllPerson() {
    this._commonService.get(`Person/GetAllEmployeeList`).subscribe(res => {
      this.personList = res;
    })
  }
  addDepartment() {
    this.isDepartmentAdd = true;
    this.departmentId = '';
    this.isDepartmentTitle = true;
    this.departmentForm.reset();
  }

  saveDepartment() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }
    const payload = {
      organizationId: localStorage.getItem('orgId'), 
      ...this.departmentForm.value
    }; 
    if (this.departmentId) {
      const updatePayload = {
        id: this.departmentId,
        ...payload
      };
      this._commonService.put('Department', updatePayload).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Department updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.departmentForm.reset();
          this.getAllDepartment();
          this.departmentId = '';
        }
      });
    } else {
      this._commonService.post('Department', payload).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Department added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.departmentForm.reset();
          this.getAllDepartment();
        }
      });
    }
  }
  getAllDepartment() {
    this.api.get(`Department`).subscribe((res) => {
      this.dataSource.data = res;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    });
  }

  getEarningDeducation(departmentId: string){
    this.router.navigate([`/salary-components-details/${departmentId}`]);
  }

  resetForm() {
    this.isDepartmentAdd = false;
    this.departmentId = '';
    this.departmentForm.reset();
  }

  editDepartment(element: any) {
    this.isDepartmentAdd = false;

    this._commonService.get('Department/GetById?id=' + element.id).subscribe((res: any) => {
      if (res) {
        this.departmentId = res.id;
        this.departmentForm.patchValue({
          departmentName: res.departmentName,
          departmentHead: res.departmentHead
        });
      }
    });
    this.isDepartmentTitle = false;
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete('Department' + `/${element.id}`).subscribe(
        (res) => {
          if (res?.statusCode == 200 || !res) {
            this._commonService.showToast('Department deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
            this.getAllDepartment();
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
  trimNameOnBlur(controlName: string) {
    const control = this.departmentForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
