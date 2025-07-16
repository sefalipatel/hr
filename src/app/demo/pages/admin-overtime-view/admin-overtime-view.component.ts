import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { InsurancePerson, userRole } from 'src/app/assets.model';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastType } from '../../models/models';
import { Department, Designation } from 'src/app/service/common/common.model';

export enum LeaveStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2
}
export const LeaveStatusLable = {
  [LeaveStatus.Pending]: 'Pending',
  [LeaveStatus.Approved]: 'Approved',
  [LeaveStatus.Rejected]: 'Rejected'
};

@Component({
  selector: 'app-admin-overtime-view',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './admin-overtime-view.component.html',
  styleUrls: ['./admin-overtime-view.component.scss']
})
export class AdminOvertimeViewComponent implements OnInit {
  years: number[] = [];
  months: { value: number; name: string }[] = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  selectedMonth: number;
  selectedYear: number;
  public userRole: Array<userRole> = [];
  displayedColumns: string[] = ['name', 'otDate', 'otHour', 'description', 'status', 'approvedBy', 'Action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public departmentList: any[] = [];
  public employeeList: any[] = [];
  public personID: any;
  public departmentID: any;
  public totalEmployee: number;
  designationId: string = '';
  public totalHours: number;
  PersonId: string = '';
  public deptId: string;
  PersonID: string = '';
  public pendingRequestCount: number;
  public rejectedRequestCount: number;
  loading: boolean = false;
  public tableData: Array<Designation> = [];
  Designation: Array<Designation> = [];
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');
  public getAllEmplyeeList: InsurancePerson[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  allDepartment: Department[] = [];

  constructor(
    private toastr: ToastrService,
    private _commonService: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getAllDepartment();
    this.getAllOvertimeRequest();
    this.getAllperson()
  }

  getAllOvertimeRequest() {
    this.loading = true;
    this.personID = this.personID ?? '';
    this._commonService.get(`Overtime?Year=${this.selectedYear}&Month=${this.selectedMonth}&userId=${this.personID}`).subscribe((res) => {
      this.loading = false;
      (this.totalEmployee = res?.value?.overtimeEmployee),
        (this.totalHours = res?.value?.overtimeHours),
        (this.pendingRequestCount = res?.value?.pendingRequest),
        (this.rejectedRequestCount = res?.value?.rejectedRequest),
        (this.dataSource = new MatTableDataSource<any>(res?.value?.overtime));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  async onYearSelected(year) {
    this.selectedYear = year;
  }
  onMonthSelected(Month) {
    this.selectedMonth = Month;
  }

  getAllDepartment() {
    this._commonService.get(`Department`).subscribe((res) => {
      this.departmentList = res;
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
  onDepartmentChange() {
    this.designationId = '';
    this.personID = '';
    this.Designation = [];
    this.employeeList = [];
    this.getAllperson(this.deptId, '');

    if (!this.deptId) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  onDesignationChange() {
    this.personID = '';
    this.employeeList = [];

    this.getAllperson('', this.designationId);
  }

  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this._commonService.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.employeeList = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });
  }
 
  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }
  async approval(id) {
    this._commonService.put(`Overtime/${id}/${LeaveStatus.Approved}`, '').subscribe((res) => {
      this._commonService.showToast('Overtime request approved', ToastType.SUCCESS, ToastType.SUCCESS);
      this.getAllOvertimeRequest();
    });
  }

  async reject(id) {
    this._commonService.put(`Overtime/${id}/${LeaveStatus.Rejected}`, '').subscribe((res) => {
      this._commonService.showToast('Overtime request rejected', ToastType.SUCCESS, ToastType.SUCCESS);
      this.getAllOvertimeRequest();
    });
  }

  onReset() {
    this.departmentID = '';
    this.getAllOvertimeRequest();
    this.deptId = '';
    this.designationId = '';
    this.personID = '';
    this.Designation = [];
    this.getAllEmplyeeList = [];
  }
}
