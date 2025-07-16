import { Component, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
import { ToastType } from '../../models/models';
import { SweetalertService } from '../role-list/sweetalert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NewLeaveBalanceComponent } from '../new-leave-balance/new-leave-balance.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
export enum UpComingLeave {
  UpcomingLeave = 1,
  UpcomingHoliday = 2,
  Both = 3
}
export enum PastLeave {
  PastLeave = 1,
  PastHoliday = 2,
  Both = 3
}

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
  [LeaveStatus.UnPaid]: 'UnPaid'
};

export interface PeriodicElement {
  leavedate: string;
  request: string;
  leavetype: string;
  reason: string;
  status: string;
  wfh: number;
  approval: number;
  remark: string;
  leaveType: number;
}

@Component({
  standalone: true,
  selector: 'app-new-leave-component',
  templateUrl: './new-leave-component.component.html',
  styleUrls: ['./new-leave-component.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    NewLeaveBalanceComponent,
    MatSidenavModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class NewLeaveComponentComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;
  customTooltip: any;
  hoverTrigger3: MatMenuTrigger;
  upcomingLeaveOptions = [
    { value: 1, label: 'Upcoming Leave' },
    { value: 2, label: 'Past Leave' } 
  ];

  pastLeaveOptions = [
    { value: PastLeave.PastLeave, label: 'Past Leave' },
    { value: PastLeave.PastHoliday, label: 'Past Holidays' },
    { value: PastLeave.Both, label: 'Past Leave & Holidays' }
  ];

  personId: { personID: string };
  id: string;
  loading: boolean = false;
  selectedYear: any;
  years: string[] = [];
  public userRole: any[] = [];
  attachmentURL: string = environment.apiUrl.replace('api/', '');
  totalPending: number;
  totalRejected: number;
  totalApprove: number;
  totalwfh: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterAllleave: any;
  totalLeaveBlance: any;
  LeaveDetail: any;
  leaveTypeList: any[] = [];
  upcomingLeaveList: any[] = [];
  pastLeaveList: any[] = [];

  public selectedUpcomingLeave = 1;
  public selectedPastLeave = UpComingLeave.UpcomingLeave;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  dateFormat: string = localStorage.getItem('Date_Format');
  drawer: any;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService,
    private api: CommonService
  ) { }

  ngOnInit() {
    const savedStart = localStorage.getItem('leaveStartDate');
    const savedEnd = localStorage.getItem('leaveEndDate');

    this.startDate = savedStart ? new Date(savedStart) : null;
    this.endDate = savedEnd ? new Date(savedEnd) : null;

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'AttendenceLeave';
      });
    }

    this.personId = JSON.parse(localStorage.getItem('userInfo'));

    this.setFinancialYears(); 
    this.getLeaveBlance();
    this.getAllLeaveType();
    this.getAllUpcomingLeave(); 
    this.loading = false;
  }

  displayedColumns: string[] = ['Leave', 'RequestDate', 'LeaveType', 'leaveDays', 'Reason', 'Status', 'WFH', 'Remark', 'actions'];
  displayedColumns2: string[] = ['date', 'leavetype', 'reason'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSource2 = new MatTableDataSource<any>();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setFinancialYears() {
    this.years = [];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are 0-indexed

    // Determine default financial year
    let startYear: number;
    if (currentMonth >= 4) {
      startYear = currentYear;
    } else {
      startYear = currentYear - 1;
    }

    this.selectedYear = `${startYear}-${startYear + 1}`;

    for (let i = 0; i <= 5; i++) {
      const year = startYear - i;
      this.years.push(`${year}-${year + 1}`);
    }
  }
  getAllLeaveType() {
    this.api.get(`EmployeeLeave/PersonLeave?personId=${this.personId.personID}`).subscribe((res: any) => {
      if (res) {
        this.leaveTypeList = res || [];
      }
    });
  }

  onLeaveChange(event?: any) {
    this.selectedUpcomingLeave = this.selectedUpcomingLeave ?? event;

    if (this.selectedUpcomingLeave === 1) {
      this.getAllUpcomingLeave();
    } else {
      this.getAllPastLeave();
    }
  }
  getAllUpcomingLeave(event?: any) {
    this.dataSource.data = [];
    this.selectedUpcomingLeave = this.selectedUpcomingLeave ?? event;
    if (!this.personId?.personID || !this.selectedYear) {
      return;
    }
    this.api.get(`EmployeeLeave/UpcomingLeave?personId=${this.personId.personID}&year=${this.selectedYear}`).subscribe((res: any) => {
      if (res) {
        this.upcomingLeaveList = res || [];
        this.dataSource.data = this.upcomingLeaveList;
      }
    });
  }

  getAllPastLeave(event?: any) {
    this.dataSource.data = [];
    this.selectedPastLeave = this.selectedPastLeave ?? event;
    this.api.get(`EmployeeLeave/PastLeave?personId=${this.personId.personID}&year=${this.selectedYear}`).subscribe((res: any) => {
      if (res) {
        this.pastLeaveList = res || [];
        this.dataSource.data = this.pastLeaveList;
      }
    });
  }
  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
  onStartDateChange(): void {
    if (this.startDate) {
      localStorage.setItem('leaveStartDate', this.startDate.toISOString());
    }
  }

  onEndDateChange(): void {
    if (this.endDate) {
      localStorage.setItem('leaveEndDate', this.endDate.toISOString());
    }
  }
  private closeTimeout: any;

  openMenu(trigger: MatMenuTrigger) {
    clearTimeout(this.closeTimeout);
    trigger.openMenu();
  }

  closeMenuWithDelay(trigger: MatMenuTrigger) {
    this.closeTimeout = setTimeout(() => {
      trigger.closeMenu();
    }, 500); // delay before closing to allow user to hover over menu
  }

  tooltipMenuClosed(trigger: MatMenuTrigger) {
    clearTimeout(this.closeTimeout); // if user hovers into the menu, don't close it
  }
  @ViewChildren('menu') menuRefs!: QueryList<MatMenu>;

  onApply() {
    this.router.navigate([`new-apply-leave`]);
  }

  isButtonDisabled(data: any) {
    if (!data?.endDate) {
      return true;
    }
    const currentDate = new Date();
    const endDateFormat = new Date(data?.endDate);
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd') > this.datePipe.transform(endDateFormat, 'yyyy-MM-dd') ? true : false;
  }

  edituser(id) {
    this.router.navigate([`new-apply-leave/${id}`]); 
  } 
  async cancel(id: string): Promise<void> {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation({
      title: 'Do you really want to cancel the leave?',
      text: ' ',
      confirm: 'Yes',
      cancel: 'No'
    });

    if (confirmed) {
      try {
        await this.apiService.LeaveDelete(id);
        this.getAllUpcomingLeave(); // Refresh data after deletion
        this.api.showToast('Leave canceled successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      } catch (error) {
        this.api.showToast('Failed to cancel leave', ToastType.ERROR, ToastType.ERROR);
      }
    }
  }

  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const customFilter = (data: PeriodicElement, filter: string): boolean => {
      return this.getStatusLabel(data.approval).toLowerCase().includes(filter) || data.reason.toLowerCase().includes(filter);
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length === 0) {
    }
  }

  async onYearSelected(year) {
    this.selectedYear = year;
    this.onLeaveChange(); 
  }

  async filterYearMonthData() {
    const fromdata = {
      year: this.selectedYear
    };
    const response = await this.apiService.YearMonthwiseFilter(fromdata);
    this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
    this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
    this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;

    this.filterAllleave = response;
    this.dataSource.data = response;
  }

  async AllLeave() {
    const fromdata = {
      year: this.selectedYear
    };
    const response = this.filterAllleave;
    this.dataSource.data = response;
    this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
    this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
    this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;
  }

  getLeaveBlance() {
    this.api.get(`EmployeeLeave/${this.personId.personID}/leavebalance`).subscribe((x) => {
      this.totalLeaveBlance = x.carryForwardLeave;
    });
  }

  getLeaveDetail() {
    const currentYear = new Date().getFullYear();
    this.api.get(`Attendance/userAttendance/${currentYear}`).subscribe((res) => {
      this.LeaveDetail = res;
    });
  }
  displayedColumnse: string[] = ['date', 'leavetype', 'reasone'];
  dataSourcee = [
    { date: '', leavetype: '', reasone: '' },
    { date: '', leavetype: '', reasone: '' },
    { date: '', leavetype: '', reasone: '' },
    { date: '', leavetype: '', reasone: '' }
  ];

  getHalfLabel(half: number): string {
    if (half === 0) return 'First Half';
    if (half === 1) return 'Second Half';
    return '-';
  }
}
