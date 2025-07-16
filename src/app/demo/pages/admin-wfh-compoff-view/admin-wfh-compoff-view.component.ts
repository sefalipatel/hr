import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'primeng/api';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { CommonService } from 'src/app/service/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/api.service';
import { userRole } from 'src/app/assets.model';
import { Designation, ToastType } from 'src/app/service/common/common.model';
import RequestDetailsComponent from '../request-details/request-details.component';
import { environment } from 'src/environments/environment';
enum LeaveStatus {
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
  selector: 'app-admin-wfh-compoff-view',
  standalone: true,
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
    MaterialModule
  ],
  templateUrl: './admin-wfh-compoff-view.component.html',
  styleUrls: ['./admin-wfh-compoff-view.component.scss']
})
export class AdminWfhCompoffViewComponent implements OnInit {
  loading: boolean = false;
  public userRole: Array<userRole> = [];
  Designation: Array<Designation> = [];
  displayedColumns: string[] = ['position', 'personName', 'wfhDate', 'leaveTypeName', 'leaveFile', 'reason', 'Status', 'Action'];
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
  // DesignationID: string = '';
  PersonName: any;
  DepartmentName: any;
  InOutTime: any;
  designationId: string = '';
  PersonId: string = '';
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');
  attachmentURL: string = environment.apiUrl.replace('api/', '');
  imageUrl: string = this.attachmentURL;
  @ViewChild(MatSort) sort: MatSort;
  requestTypeList = [
    { name: 'Work From Home', value: 'WorkFromHome' },
    { name: 'Comp Off', value: 'CompOff' }
  ];

  statusList = [
    { name: 'Pending', id: 0 },
    { name: 'Approved', id: 1 },
    { name: 'Rejected', id: 2 }
  ];
  public selectedRequestType: number | null = null;
  public selectedStatusType: Number | null = null;
  public getUserRequestData: any;
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
  filterLeaveType(type: number | null): void {
    this.selectedRequestType = type;
    let filteredData = this.getUserRequestData;

    if (type !== null) {
      filteredData = filteredData.filter((item) => item.leaveType === type);
    }

    this.dataSource.data = filteredData;
  }

  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
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

  getEmployeeWFHCompOff(): void {
    this.api.get('EmployeeWFHCompOff/AdminWFHCompOffList').subscribe((res: any[]) => {
      const tableData = res.map((item, index) => {
        const relativePath = item.leaveFile ? item.leaveFile : null;
        const fileUrl = relativePath ? `${this.attachmentURL}${relativePath.replace('wwwroot\\', '')}` : null;

        return {
          position: index + 1,
          personName: item.personName,
          wfhDate: this.datePipe.transform(item.wfhDate, this.dateFormat),
          leaveTypeName: item.leaveTypeName,
          leaveFile: fileUrl,
          reason: item.reason,
          id: item.id || '',
          symbol: '', 
          approval: item.approval
        };
      });

      this.dataSource.data = tableData;
      this.dataSource.paginator = this.paginator;
    });
  }

  getAllFilteredRequest() {
    this.PersonID = this.PersonID ?? '';
    this.loading = true;
    this.api
      .get(`EmployeeWFHCompOff/FilterWFHCompOff?year=${this.selectedYear}&month=${this.selectedMonth}&personId=${this.PersonID}`)
      .subscribe((x: any[]) => {
        this.loading = false;

        this.alltimesheetDetails = x.map((item) => {
          const relativePath = item.leaveFile ? item.leaveFile : null;
          const fileUrl = relativePath ? `${this.attachmentURL}${relativePath.replace('wwwroot\\', '').replace(/\\/g, '/')}` : null;

          return {
            ...item,
            leaveFile: fileUrl 
          };
        });

        this.dataSource.data = this.alltimesheetDetails;
      });
  }

  onReset() {
    this.PersonID = '';
    this.deptId = '';
    this.designationId = ''; 
    this.getEmployeeWFHCompOff();
    this.Designation = [];
    this.PersonName = [];
    this.getAllEmplyeeList = [];
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
  requestType(type: { name: any; value: any }) {
    this.selectedRequestType = type ? type.value : null;
    this.requestTypeFilter();
  }

  requestTypeFilter(): void {
    let filteredData = this.alltimesheetDetails;

    // Filter by request type if selected
    if (this.selectedRequestType !== null) {
      filteredData = filteredData.filter((item) => item.leaveTypeName === this.selectedRequestType);
    }

    // Filter by status if selected
    if (this.selectedStatusType !== null) {
      filteredData = filteredData.filter((item) => item.approval === this.selectedStatusType);
    }

    this.dataSource.data = filteredData;
  }

  selectStatus(status: { name: string; id: number } | null): void {
    this.selectedStatusType = status ? status.id : null;
    this.requestTypeFilter();
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

  async approval(id) {
    const from = {
      id: id,
      approval: 1
    };

    this.loading = true;
    await this.apiService.ApproveRejectWFHCompOff(from);
    this.api.showToast('WFH/CompOff request approved', ToastType.SUCCESS, ToastType.SUCCESS);
    this.getEmployeeWFHCompOff();
    this.loading = false;
  }

  async reject(id) {
    const from = {
      id: id,
      approval: 2,
      RejectionReason: ''
    };

    this.loading = true;
    await this.apiService.ApproveRejectWFHCompOff(from);
    this.api.showToast('WFH/CompOff request rejected', ToastType.SUCCESS, ToastType.SUCCESS);
    this.getEmployeeWFHCompOff();
    this.loading = false;
  }
}

export interface PeriodicElement {
  id: string; // or some other unique identifier
  personName: string;

  position: number;
  approval: number;
  wfhDate: string;
  symbol: string; 
  leaveFile: string;
  reason: string;
}
