import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Role, ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from './sweetalert.service';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';

interface data {
  value: string;
}
@Component({
  selector: 'app-role-list',
  standalone: true,
  templateUrl: './role-list.component.html',
  imports: [MatProgressSpinnerModule, MatTableModule, CommonModule, MatPaginatorModule, SharedModule],
  styleUrls: ['./role-list.component.scss']
})

export default class RoleListComponent implements OnInit {

  public roleList: Role[] = []
  initChecked = false;
  isRoleAdd: boolean = false;
  loading: boolean = false;
  isSubmitting : boolean = false;
  roleId: string = ''
  public tableData: Array<Role> = [];
  public defaultImg: string = 'assets/img/product/product1.jpg';
  public skip: number = 0
  public limit: number = 10
  roleForm: FormGroup;
  @Output() delete: EventEmitter<string> = new EventEmitter();

  public userRole: Array<userRole> = [];

  // pagination variables
  dataSource!: MatTableDataSource<Role>;
  public searchDataValue = '';
  public resetCurrentPage: boolean = false;
  public sortConfig!: Sort
  public searchTerm: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ["name", "actions"];

  constructor(
    private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    private _fb: FormBuilder
  ) {
    this.roleForm = this._fb.group({
      name: ['', [Validators.required]]
    })
    this.getAllRoles();
    if (this.router.url == 'rolelist') {
      this.getTableData();
    }
  }
  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole')); if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Roles";
      })
    }
  }

  get f() {
    return this.roleForm.controls;
  }

  async deleteBtn(id: string | any) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    this.delete.emit(confirmed ? id : "")
    if (confirmed) {
      this._commonService.delete('Roles/deleteRole' + `/${id}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Role deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllRoles();
        }
        if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  private getTableData(): void {
    this.tableData = this.roleList;
    if (this.searchTerm) {
      this.resetCurrentPage = this.searchTerm ? true : false;
      this.tableData = this.tableData?.filter(x => x.name?.trim()?.toLocaleLowerCase()?.includes(this.searchTerm.trim().toLowerCase()));
    }
    if (this.sortConfig) {
      const data = this.tableData?.slice();
      if (!this.sortConfig.active || this.sortConfig.direction === '') {
        this.tableData = data;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.tableData = data.sort((a: any, b: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const aValue = (a as any)[this.sortConfig.active];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bValue = (b as any)[this.sortConfig.active];
          return (aValue?.trim()?.toLowerCase() < bValue?.trim()?.toLowerCase() ? -1 : 1) * (this.sortConfig.direction === 'asc' ? 1 : -1);
        });
      }
    }
    this.dataSource = new MatTableDataSource<Role>(this.tableData);
  }

  public searchData(value: string): void {
    this.searchTerm = value;
    this.getTableData();
    return;
  }

  public sortData(sort: Sort | any) {
    this.sortConfig = sort;
    this.getTableData();
    return;
  }

  // select all checkbox
  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }

  getAllRoles() {
    this.loading = true
    let orgId = localStorage.getItem('orgId');
    this.reset()
    this.roleList = [];
    this._commonService.get('Roles/RoleByOrgId' + `/${orgId}`).subscribe((res) => {
      this.loading = false
      if (res?.statusCode == 200) {
        this.roleList = res?.value ?? [];
        this.tableData = this.roleList;
        this.getTableData();
      }
    }, (err) => {
    })
  }

  // set the all value into form on click on edit
  getRoleById(id: string) {
    this._commonService.get('Roles' + `/${id}`).subscribe((res) => {
      this.roleForm.patchValue(res?.value)
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  // open form on role add button
  roleAdd() {
    this.isRoleAdd = true;
    this.roleId = '';
  }

  // get particular role as click on edit
  editRole(id: string | any) {
    this.isRoleAdd = false;
    this.roleId = id;
    this.getRoleById(id);
  }

  reset() {
    this.roleForm.reset();
    this.isRoleAdd = false;
    this.roleId = '';
  }

  // role add and edit
  saveRole() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }
    if (this.isRoleAdd) {
      let payload = {
        orgId: localStorage.getItem('orgId'),
        Name: this.roleForm.value.name
      }
      this._commonService.post('Roles/AddRoleWithPermissions', payload).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast('Role Added Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.getAllRoles();
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    } else {
      this._commonService.put('Roles', { Name: this.roleForm.value.name, id: this.roleId }).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast('Role Updated Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.getAllRoles();
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  trimNameOnBlur(controlName: string) {
    const control = this.roleForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
