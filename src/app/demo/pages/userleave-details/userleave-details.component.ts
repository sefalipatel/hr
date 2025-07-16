import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

export enum LeaveStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  cancelled = 3,
  UnPaid = 4
}

export const LeaveStatusLable = {
  [LeaveStatus.Pending]: 'Pending',
  [LeaveStatus.Approved]: 'Approved',
  [LeaveStatus.Rejected]: 'Rejected',
  [LeaveStatus.cancelled]: 'cancelled',
  [LeaveStatus.UnPaid]: 'UnPaid',

};

enum LeaveType {
  Leave = 0,
  WorkFromHome = 1,
  MaternityLeave = 2,
  PaternityLeave = 3,
  CompOff = 4,
}
const LeaveTypeLable = {

  [LeaveType.Leave]: 'Leave',
  [LeaveType.WorkFromHome]: 'Work From Home',
  [LeaveType.MaternityLeave]: 'Maternity Leave',
  [LeaveType.PaternityLeave]: 'Paternity Leave',
  [LeaveType.CompOff]: 'Comp Off'
};
@Component({
  selector: 'app-userleave-details',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, DatePipe, MatPaginatorModule, MatIconModule, CommonModule, MomentDateModule, MatProgressSpinnerModule, FormsModule, MatTooltipModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './userleave-details.component.html',
  styleUrls: ['./userleave-details.component.scss'],
})

export default class UserleaveDetailsComponent implements OnInit {
  months: { value: number, name: string }[] = [
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
  selectedMonth: number
  personId: { personID: string }
  id: string;
  loading: boolean = false;
  selectedYear: number;
  years: number[] = [];
  public userRole: any[] = [];
  attachmentURL: string = environment.apiUrl.replace('api/', '')
  totalPending: number
  totalRejected: number
  totalApprove: number
  totalwfh: number
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterAllleave: any;
  totalLeaveBlance: any;
  LeaveDetail: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService,
    private api: CommonService
  ) { }

  ngOnInit() {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "AttendenceLeave";
      })
    }

    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    const currentYear = new Date().getFullYear();

    for (let year = currentYear+1; year >= currentYear - 6; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();

    this.filterYearMonthData()
    this.getLeaveBlance()
    this.getLeaveDetail();
    this.loading = false;
  }

  displayedColumns: string[] = ['Leave', 'RequestDate', 'LeaveType', 'Reason', 'Status', 'WFH', "Remark", 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>();


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  isButtonDisabled(data: any) {
    if (!data?.endDate) {
      return true;
    }
    const currentDate = new Date();
    const endDateFormat = new Date(data?.endDate);
    return (this.datePipe.transform(currentDate, 'yyyy-MM-dd') > this.datePipe.transform(endDateFormat, 'yyyy-MM-dd')) ? true : false;
  }

  edituser(id) { 
    this.router.navigate([`leave-details/apply-leave/${id}`]);
  }

  LeaveDetailsAddd() {
    this.router.navigate(['leave-details/apply-leave']);
  }

  async cancel(id: string): Promise<void> {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation({ title: 'Cancel leave', text: " ", confirm: 'Yes', cancel: 'No' });
    if (confirmed) {
      try {
        await this.apiService.LeaveDelete(id);
        this.dataSource.data = this.filterAllleave.filter((element) => element.id !== id);
        this.filterYearMonthData()
        this.api.showToast('Leave canceled successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      } catch (error) {
      }
    }
  }

  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  getLeavetypeLable(status: number): string {
    return LeaveTypeLable[status] || 'Unknown';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const customFilter = (data: PeriodicElement, filter: string): boolean => {
      return (

        this.getStatusLabel(data.approval).toLowerCase().includes(filter) || data.reason.toLowerCase().includes(filter) || this.getLeavetypeLable(data.leaveType).toLocaleLowerCase().includes(filter)
      );
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length === 0) {
    }
  }

  async onYearSelected(year) {
    this.selectedYear = year
    this.filterYearMonthData()
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month
    this.filterYearMonthData()
  }
  async filterYearMonthData() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }
    const response = await this.apiService.YearMonthwiseFilter(fromdata)
    this.totalPending = response.filter(element => element.approval === LeaveStatus.Pending).length;
    this.totalRejected = response.filter(element => element.approval === LeaveStatus.Rejected).length;
    this.totalApprove = response.filter(element => element.approval === LeaveStatus.Approved).length;
    this.totalwfh = response.filter(element => element.leaveType === LeaveType.WorkFromHome).length;

    this.filterAllleave = response
    this.dataSource.data = response
  }

  async AllLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }
    const response = this.filterAllleave
    this.dataSource.data = response
    this.totalPending = response.filter(element => element.approval === LeaveStatus.Pending).length;
    this.totalRejected = response.filter(element => element.approval === LeaveStatus.Rejected).length;
    this.totalApprove = response.filter(element => element.approval === LeaveStatus.Approved).length;
    this.totalwfh = response.filter(element => element.leaveType === LeaveType.WorkFromHome).length;
  }
  async pendingLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }
    const filterPandingList = this.filterAllleave.filter((x) => {
      return x.approval === LeaveStatus.Pending
    })
    this.dataSource.data = filterPandingList
  }
  async RejectLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }
    const filterRejectedList = this.filterAllleave.filter((x) => {
      return x.approval === LeaveStatus.Rejected
    })
    this.dataSource.data = filterRejectedList
  }
  async ApproveLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }
    const filterPandingList = this.filterAllleave.filter((x) => {
      return x.approval === LeaveStatus.Approved
    })
    this.dataSource.data = filterPandingList
  }
  async WorkFromHome() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }
    const filter = this.filterAllleave.filter((x) => {

      return x.leaveType === LeaveType.WorkFromHome
    })
    this.dataSource.data = filter
  }

  getLeaveBlance() {
    this.api.get(`EmployeeLeave/${this.personId.personID}/leavebalance`).subscribe((x) => {
      this.totalLeaveBlance = x.carryForwardLeave
    })
  }

  getLeaveDetail() {
    const currentYear = new Date().getFullYear();
    this.api.get(`Attendance/userAttendance/${currentYear}`).subscribe((res) => {
      this.LeaveDetail = res;
    })
  }

}
export interface PeriodicElement {
  id: string;
  Ename: string;
  Leave: string;
  position: number;
  Status: string;
  Reason: string;
  person: { firstName: string };
  approval: number
  reason: string
  leaveType: number
}