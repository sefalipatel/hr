import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Department, Designation, ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-leave-settings',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './leave-settings.component.html',
  styleUrls: ['./leave-settings.component.scss']
})
export class LeaveSettingsComponent {
 public isleavetypeAdd: boolean = false;
  public isleavetypeTittle: boolean = false;
  public leaveTypeId: string = '';
  Department: Array<Department> = [];
  Designation: Array<Designation> = [];
  public leavetypeform: FormGroup;
   dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    
  constructor(
    private formBuilder: FormBuilder,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService
  ) {
    this.leavetypeform = this.buildform();
  }

  displayedColumns: string[] = ['leaveType', 'days', 'departmentName', 'designationName', 'actions'];

  leaveSettingList: any[] = [];
  leaveTypeList: any[] = [];

  ngOnInit(): void {
    this.api.get(`Designation`).subscribe((response) => {
      this.Designation = response;
    });
    this.api.get(`Department`).subscribe((response) => {
      this.Department = response;
    });
    this.getAllLeaveSettings();
    this.getAllLeaveTypes();
  }

  buildform() {
    return this.formBuilder.group({
      leaveTypeId: ['', Validators.required],
      leaveDays: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      DepartmentId: ['',],
      DesignationId: ['',],
      organizationId: [localStorage.getItem('orgId')]
    });
  }
  get leavetypeFormControl() {
    return this.leavetypeform.controls;
  }
  addLeaveType() {
    this.isleavetypeAdd = true;
    this.leaveTypeId = '';
    this.isleavetypeTittle = true;
  }

  resetForm() {
    this.leavetypeform.reset();
    this.isleavetypeTittle = false;
    this.leaveTypeId = '';
  }
  trimNameOnBlur(controlName: string) {
    const control = this.leavetypeform.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

  onSubmit() {
    if (this.leavetypeform.invalid) {
      this.leavetypeform.markAllAsTouched();
      return;
    }

    const formData = this.leavetypeform.value;

    if (this.leaveTypeId === '') {
      this.api.post('LeaveSetting', formData).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._commonService.showToast('Leave settings added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllLeaveSettings();
          this.resetForm();
        }
      }, err => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
      });
    } else {
      this.api.put('LeaveSetting', { id: this.leaveTypeId, ...formData }).subscribe((res: any) => {
        if (res) {
          this._commonService.showToast('Leave settings updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllLeaveSettings();
          this.resetForm();
        }
      }, err => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
      });
    }
  }

editLeaveType(id: string) {
  this.isleavetypeTittle = true;
  this.api.get(`LeaveSetting/${id}`).subscribe((res: any) => {
    if (res.statusCode === 200 && res.value) {
      const item = res.value;
      this.leavetypeform.patchValue({
        leavetype: item.name,
        leaveTypeId: item.leaveTypeId,
        leaveDays: item.leaveDays,
        DepartmentId: item.departmentId,
        DesignationId: item.designationId,
      });
      this.leaveTypeId = item.id;
      this.isleavetypeAdd = true;
      this.isleavetypeTittle = false;
    }
  });
}

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete('LeaveType' + `/${element.id}`).subscribe(
        (res) => {
          if (res?.statusCode == 200 || !res) {
            this._commonService.showToast('Leave-type deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
            this.getAllLeaveSettings();
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

  getAllLeaveSettings() {
    this._commonService.get('LeaveSetting').subscribe((res: any) => {
      if (res) {
        this.leaveSettingList = res?.value || [];
        this.dataSource = new MatTableDataSource<any>(this.leaveSettingList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  getAllLeaveTypes() {
    this._commonService.get('LeaveType').subscribe((res: any) => {
      if (res.isSuccessful === false && res.statusCode === 200) {
        this.leaveTypeList = res?.value || [];
        this.dataSource = new MatTableDataSource<any>(this.leaveSettingList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}
