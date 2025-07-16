import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/api.service';
import { LeaveStatusLable } from '../userleave-details/userleave-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import RequestDetailsComponent from '../request-details/request-details.component';
import { userRole } from 'src/app/assets.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'primeng/api';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import moment from 'moment';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { AttendanceLogComponent } from '../atteandace/attendance-log/attendance-log.component';
import { Designation } from 'src/app/service/common/common.model';
import { MatSort } from '@angular/material/sort';
import { AdminOvertimeViewComponent } from '../admin-overtime-view/admin-overtime-view.component';
import { PersonCheckinOutComponent } from '../person-checkin-out/person-checkin-out.component';
import { AdminWfhCompoffViewComponent } from '../admin-wfh-compoff-view/admin-wfh-compoff-view.component';

export enum LeaveRequestType {
  InTime = 0,
  OutTime = 1,
  Both = 2 
}

export const LeaveRequestTypeLable = {
  [LeaveRequestType.InTime]: 'Mark As InTime',
  [LeaveRequestType.OutTime]: 'Mark As OutTime',
  [LeaveRequestType.Both]: 'Mark As Both'
  // [LeaveRequestType.MarkAsLop]: "Mark As Lop"
};

@Component({
  selector: 'app-admine-request-approval',
  standalone: true,
  templateUrl: './admine-request-approval.component.html',
  imports: [
    MatTableModule,
    DatePipe,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MaterialModule,
    AdminOvertimeViewComponent,
    PersonCheckinOutComponent,
    AdminWfhCompoffViewComponent
  ],
  providers: [DatePipe],
  styleUrls: ['./admine-request-approval.component.scss']
})
export default class AdmineRequestApprovalComponent implements OnInit {
  loading: boolean = false;
  public userRole: Array<userRole> = [];
  Designation: Array<Designation> = [];
  displayedColumns: string[] = [
    'position',
    'personName',
    'requestDate',
    'LeaveTypeLable',
    'actualTime',
    'symbol',
    'requestType',
    'Status',
    'Action'
  ];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource([]);
  public tableData: Array<Designation> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  getAllEmplyeeList: any;
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
  datafilterTimesheet: any;
  years: number[] = [];
  startDate = moment(new Date()).subtract(21, 'days').toDate();
  Alldata: { startDate: string; endDate: string; totalHours: number; status: number; id: string }[] = [];
  public allDepartment: any;
  alltimesheetDetails: any;
  personId: { personID: string };
  PersonID: any;
  DepartmentID: any; 
  PersonName: any;
  DepartmentName: any;
  InOutTime: any;
  designationId: string = '';
  PersonId: string = '';
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');
  @ViewChild(MatSort) sort: MatSort;
  requestTypeList = [
    { name: 'Add', value: 0 },
    { name: 'Update', value: 1 }
  ];
  statusList = [
    { name: 'Pending', id: 0 },
    { name: 'Approved', id: 1 },
    { name: 'Rejected', id: 2 }
  ];
  public selectedRequestType: string | null = null;
  public selectedStatusType: string | null = null;
  deptId: any;

  constructor(
    private apiService: ApiService,
    private _commonService: CommonService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private api: CommonService,
    private datePipe: DatePipe
  ) {}
  selectedIndex: number = 0;
  onTabChange(event: any): void {
    this.selectedIndex = event.index;
  }

  async ngOnInit() { 
    this.getAllDepartment();
    this.getAllperson();
    this.DepartmentID = '';
    this.PersonID = '';
    this.loading = true;
    this.loading = false;
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getAllFilteredRequest();
  }

  async onYearSelected(year) {
    this.selectedYear = year;
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllFilteredRequest() {
    this.PersonID = this.PersonID ?? '';
    this.loading = true;
    this.api
      .get(`AttendanceRequest/GetAttendanceRequestByAdmin?year=${this.selectedYear}&month=${this.selectedMonth}&userId=${this.PersonID}`)
      .subscribe((x) => {
        this.loading = false;
        this.alltimesheetDetails = x;
        this.dataSource.data = this.alltimesheetDetails;
      });
  }

  onReset() {
    this.PersonID = '';
    this.deptId = '';
    this.designationId = '';
    this.getAllFilteredRequest();
    this.Designation = [];
    this.PersonName = [];
    this.getAllEmplyeeList = [];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    // Custom filter function to filter by EmployeeName, Status, Reason, or Leave Type
    const customFilter = (data: PeriodicElement, filter: string): boolean => {
      return (
        (data.person?.firstName?.toLowerCase() || '').includes(filter) ||
        (this.getStatusLabel(data.status)?.toLowerCase() || '').includes(filter) ||
        (data.reason?.toLowerCase() || '').includes(filter) ||
        (this.getStatusLeaveTypeLabel(data.requestType)?.toLowerCase() || '').includes(filter)
      );
    };
    this.dataSource.filterPredicate = customFilter;
    // Always set the filter, even if it's an empty string
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length === 0) {
    }
  }

  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  getStatusLeaveTypeLabel(status: number): string {
    return LeaveRequestTypeLable[status] || 'Unknown';
  }

  async approval(id) {
    const from = {
      id: id,
      Status: 1
    }; 
    const response = await this.apiService.AttendanceAddDatastatusUpdate(from);
    this.loading = false;
    this.api.showToast('Attendance request approved', ToastType.SUCCESS, ToastType.SUCCESS);
    this.getAllFilteredRequest();
  }

  openPopup(id) {
    const dialogRef = this.dialog.open(RequestDetailsComponent, {
      width: '800px',
      data: { id, dataSource: this.dataSource.data }
    });
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
    });
  }

  async reject(id) {
    const from = {
      id: id,
      Status: 2,
      RejectReason: ''
    };
    this.loading = true;
    const response = await this.apiService.AttendanceAddDatastatusUpdateReject(from);
    this.loading = false;
    this.api.showToast('Attendance request rejected', ToastType.SUCCESS, ToastType.SUCCESS);
    this.getAllFilteredRequest();
  }

  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this.api.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.getAllEmplyeeList = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
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
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    });
  }
  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.PersonID = '';
    this.Designation = [];
    this.getAllEmplyeeList = [];
    this.getAllperson(this.deptId, '');

    if (!this.deptId) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.PersonID = '';
    this.getAllEmplyeeList = [];
    this.getAllperson('', this.designationId);
  }
  getViewAttendance(personId: any, date) {
    let dateset = this.datePipe.transform(date, 'yyyy-MM-dd');
    let dialogRef!: any;
    this.api.get(`AttendanceDetails/AttendanceDetails?personId=${personId}&date=${dateset}`).subscribe((x) => {
      this.InOutTime = x;
      dialogRef = this.dialog.open(AttendanceLogComponent, {
        data: {
          data: this.InOutTime,
          id: personId,
          date: dateset
        }
      });
    });
  }
  convertRequestType(value) {
    const type = ['Add', 'Update'];
    let list = type.filter((item, index) => index == value);
    return list;
  }
  requestType(type: { name: any; value: any }) {
    this.selectedRequestType = type ? type.value : null;
    this.requestTypeFilter();
  }
  requestTypeFilter(): void {
    const selectedRequestType = this.requestTypeList;
    const selectedStatusType = this.statusList;
    let filteredData = this.alltimesheetDetails;
    // Filter request type
    if (this.selectedRequestType !== null) {
      filteredData = filteredData.filter((item) => item.requestType === this.selectedRequestType);
    }
    // Filter status type
    if (this.selectedStatusType !== null) {
      filteredData = filteredData.filter((item) => item.status === this.selectedStatusType);
    }
    this.dataSource.data = filteredData;
  }

  selectStatus(type: { name: any; id: any }) {
    this.selectedStatusType = type ? type.id : null;
    this.requestTypeFilter();
  }
}

export interface PeriodicElement {
  id: string;
  personName: string;
  person: { firstName: string };
  position: number;
  requestDate: string;
  symbol: string;
  Status: number;
  status: number;
  reason: string;
  requestType: number;
  actualTime: string;
}
