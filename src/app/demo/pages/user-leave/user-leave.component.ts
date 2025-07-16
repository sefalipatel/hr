import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import DeletePopUpComponent from '../delete-pop-up/delete-pop-up.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import ReasonPopupComponent from '../reason-popup/reason-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { userRole } from 'src/app/assets.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SharedModule } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SweetalertService } from '../role-list/sweetalert.service';
import { Designation } from 'src/app/service/common/common.model';
import { ApplyLeaveByUserComponent } from './apply-leave-by-user/apply-leave-by-user.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDrawer } from '@angular/material/sidenav';
export enum LeaveStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  cancelled = 3,
  UnPaid = 4
}

export enum Duration {
  FirstHalf = 0,
  SecondHalf = 1,
  FullDay = 2
}

export const LeaveStatusLable = {
  [LeaveStatus.Pending]: 'Pending',
  [LeaveStatus.Approved]: 'Approved',
  [LeaveStatus.Rejected]: 'Rejected',
  [LeaveStatus.cancelled]: 'cancelled',
  [LeaveStatus.UnPaid]: 'UnPaid'
};

enum LeaveType {
  Leave = 0,
  WorkFromHome = 1,
  MaternityLeave = 2,
  PaternityLeave = 3,
  CompOff = 4
}

const LeaveTypeLable = {
  [LeaveType.Leave]: 'Leave',
  [LeaveType.WorkFromHome]: 'Work From Home',
  [LeaveType.MaternityLeave]: 'Maternity Leave',
  [LeaveType.PaternityLeave]: 'Paternity Leave',
  [LeaveType.CompOff]: 'Comp Off'
};
@Component({
  selector: 'app-user-leave',
  standalone: true,
  templateUrl: './user-leave.component.html',
  imports: [
    MatTableModule,
    SharedModule,
    MatButtonModule,
    DatePipe,
    MatPaginatorModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatSidenavModule,
    MatButtonModule
  ],
  styleUrls: ['./user-leave.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export default class UserLeaveComponent {
  LeaveStatus = LeaveStatus;
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
  personId: { personID: string };
  selectedYear: number;
  years: number[] = [];
  public userRole: Array<userRole> = [];

  totalPending: number;
  totalRejected: number;
  totalApprove: number;
  totalwfh: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Ename', 'Leave', 'RequestDate', 'LeaveType', 'duration', 'Reason', 'Status', 'WFH', 'Remark', 'actions'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource([]);
  searchTerm: string = '';
  id: string;
  currentDate: Date = new Date();
  loading: boolean = false;
  filterData: any = null;
  filePath: any;
  allLeave: any;
  DepartmentName: any;
  alltimesheetDetails: any;
  DepartmentID: any;
  designationId: string = '';
  PersonName: any;
  PersonID: any;
  getAllEmplyeeList: any;
  public allDepartment: any;
  filterAllleave: any;
  attachmentURL: string = environment.apiUrl.replace('api/', '');
  dateFormat: string = localStorage.getItem('Date_Format');
  Designation: Array<Designation> = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private sweetlalert: SweetalertService,
    private api: CommonService,
    private _commonService: CommonService,
  ) { }

  async ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.DepartmentID = '';
    this.PersonID = '';
    this.getAllDepartment();
    this.getAllperson();
    
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.loading = true;
    this.getAllEmployeeLeave();
    
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions.accessPermission.filter((item) => {
        return item?.module?.module === 'AttendenceLeave';
      });
    }
  }

  getAllEmployeeLeave() {
    this._commonService.get(`EmployeeLeave`).subscribe((res: any[]) => {
      const response = res;
      this.loading = false;

      this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
      this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
      this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;
      this.totalwfh = response.filter((element) => element.leaveType === LeaveType.WorkFromHome).length;
      this.cdr.detectChanges();

      response.forEach((element, index) => {
        element.serialNumber = index + 1;
      });
      this.allLeave = response;
      this.dataSource.data = response;
    });
  }
  async onYearSelected(year) {
    this.selectedYear = year;
  }
  onMonthSelected(Month) {
    this.selectedMonth = Month;
  }
  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this._commonService.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.PersonName = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
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
    this.getAllperson(this.DepartmentID, '');

    if (!this.DepartmentID) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.DepartmentID}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.PersonID = '';
    this.PersonName = [];

    this.getAllperson('', this.designationId);
  }

  Person(data) {
    this.PersonID = data.value;
  }

  onLeaveFilter() {
    this.PersonID = this.PersonID ?? '';
    this.api.get(`EmployeeLeave/search?personId=${this.PersonID}&year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((x) => {
      this.alltimesheetDetails = x;
      this.dataSource.data = x;
    });
  }

  onReset() {
    this.PersonID = '';
    this.DepartmentID = '';
    this.designationId = '';
    this.onLeaveFilter();
    this.getAllperson();
  }

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
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd') > this.datePipe.transform(endDateFormat, 'yyyy-MM-dd') ? true : false;
  }

  edituser(id: string, user?: string) { 
    this.router.navigate([`new-apply-leave/${id}`], {
      queryParams: { user: 'admin' }
    });
  }
  LeaveDetailsAddd() {
    this.router.navigate(['leave-details/apply-leave']);
  }

  async cancle(id: string): Promise<void> {
    const dialogRef = this.dialog.open(DeletePopUpComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'yes') {
        this.performDelete(id);
      }
    });
  }
  async performDelete(id) {
    try {
      await this.apiService.LeaveDelete(id);
      this.dataSource.data = this.dataSource.data.filter((element) => element.id !== id);
    } catch (error) { }
  }

  applyFilter(event: any) {
    const filterValue = event.value.trim().toLowerCase();
    this.searchTerm = filterValue;
    const customFilter = (data: PeriodicElement, filter: string): boolean => {
      return (
        data.person?.firstName.toLowerCase().includes(filter) ||
        this.getStatusLabel(data.approval).toLowerCase().includes(filter) ||
        data.reason.toLowerCase().includes(filter) ||
        this.getLeavetypeLable(data.leaveType).toLocaleLowerCase().includes(filter)
      );
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length === 0) {
    }
  }
  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }
  getLeavetypeLable(status: number): string {
    return LeaveTypeLable[status] || 'Unknown';
  } 
  getDurationLable(startHalf: any, endHalf: any): any {
    if (startHalf === 0 && endHalf === 0) {
      return 'First Half';
    } else if (startHalf === 1 && endHalf === 1) {
      return 'Second Half';
    } else if ((startHalf === 0 && endHalf === 1) || (startHalf === 1 && endHalf === 0)) {
      return 'Full Day';
    } else {
      return '-';
    }
  }
  getHalfLabel(half: number): string {
    if (half === 0) return 'First Half';
    if (half === 1) return 'Seconf Half';
    return '-';
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
      this.api.delete(`EmployeeLeave/${id}`).subscribe(async (res) => {
        try {
          await this.refreshLeaveData();
        } catch (error) {
          this.toastr.error('Failed to approve leave');
        }

        this.api.showToast('Leave cancelled successfully ', ToastType.SUCCESS, ToastType.SUCCESS);
      });
    }
    this.PersonID = '';
    this.DepartmentID = '';
  }

  async Approve(data) {
    const from = {
      id: data.id,
      PersonId: data.personId,
      Approval: LeaveStatus.Approved,
      ApprovedBy: JSON.parse(localStorage.getItem('userInfo'))?.personID,
      ApprovedOn: '',
      Reason: '',
      RejectionReason: ''
    };

    this.loading = true; // Show loader
    try {
      // Update leave status
      const response = await this.apiService.approveStatusUpdate(from);
      const updatedStatus = response.status;

      // Find and update the specific leave in the data source
      const leaveToUpdate = this.dataSource.data.find((element) => element.id === data.id);
      if (leaveToUpdate) {
        leaveToUpdate.approval = updatedStatus; // Update status in the local data
        this.toastr.success('Leave approved successfully.');
      }

      // Refetch the leave data to ensure the table is updated
      await this.refreshLeaveData();
    } catch (error) {
      console.error('Error approving leave:', error);
      this.toastr.error('Failed to approve leave');
    } finally {
      this.loading = false; // Hide loader
    }
    this.PersonID = '';
    this.DepartmentID = '';
  }

  async refreshLeaveData() {
    try {
      const response = await this.apiService.allLeaveDetails();

      // Update total counts
      this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
      this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
      this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;
      this.totalwfh = response.filter((element) => element.leaveType === LeaveType.WorkFromHome).length;

      // Add serial numbers to the data
      response.forEach((element, index) => {
        element.serialNumber = index + 1;
      });

      // Update the data source with the new data
      this.dataSource.data = response;
    } catch (error) {
      console.error('Error fetching leave details:', error);
      this.toastr.error('Failed to refresh leave data');
    }
  }

  async UnPaid(data) {
    const from = {
      id: data.id,
      PersonId: data.personId,
      Approval: LeaveStatus.UnPaid,
      ApprovedBy: JSON.parse(localStorage.getItem('userInfo'))?.personID,
      ApprovedOn: '',
      Reason: '',
      RejectionReason: ''
    };
    this.loading = true;
    const response = await this.apiService.approveStatusUpdate(from);
    this.loading = false;
    const updatedStatus = response.status;
    const leaveToUpdate = this.dataSource.data.find((element) => element.id === data.id);
    if (leaveToUpdate) {
      leaveToUpdate.Status = updatedStatus;
      this.toastr.success(' Unpaid leave approved successfully.');
    }

    // Update the table data source
    this.dataSource.data = [...this.dataSource.data];

    try {
      // Send an HTTP request to your API to update the status
      const response = await this.apiService.allLeaveDetails();
      this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
      this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
      this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;
      this.totalwfh = response.filter((element) => element.leaveType === LeaveType.WorkFromHome).length;

      response.forEach((element, index) => {
        element.serialNumber = index + 1;
      });

      this.dataSource.data = response;
    } catch (error) {
      console.error(error);
      // Handle the error if the API request fails
    } finally {
      this.loading = false; // Hide loader
    }
    this.PersonID = '';
    this.DepartmentID = '';
  }

  async Reject(data) {
    const dialogRef = this.dialog.open(ReasonPopupComponent, {
      width: '800px',
      data: { id: data.id, dataSource: this.dataSource.data?.find((x) => x.id == data.id) }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      const response = await this.apiService.allLeaveDetails();
      this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
      this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
      this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;
      this.totalwfh = response.filter((element) => element.leaveType === LeaveType.WorkFromHome).length;

      response.forEach((element, index) => {
        element.serialNumber = index + 1;
      });
      this.dataSource.data = response;
      dialogRef.close();
    });
    this.PersonID = '';
    this.DepartmentID = '';
  }

  async filterYearMonthData() {
    this.filterData =
      this.selectedYear || this.selectedMonth
        ? {
          year: this.selectedYear,
          month: this.selectedMonth ? this.selectedMonth : 0
        }
        : null;
    const response = await this.apiService.YearMonthwiseFilter(this.filterData);
    this.filterAllleave = response;
    this.dataSource.data = response;
    this.applyFilter({ value: this.searchTerm });
  }
  async AllLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ''
    };
    const response = this.allLeave;
    this.totalPending = response.filter((element) => element.approval === LeaveStatus.Pending).length;
    this.totalRejected = response.filter((element) => element.approval === LeaveStatus.Rejected).length;
    this.totalApprove = response.filter((element) => element.approval === LeaveStatus.Approved).length;
    this.totalwfh = response.filter((element) => element.leaveType === LeaveType.WorkFromHome).length;

    this.dataSource.data = this.allLeave;
    this.applyFilter({ value: this.searchTerm });
  }
  async pendingLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ''
    };

    const filterPandingList = this.allLeave.filter((x) => {
      return x.approval === LeaveStatus.Pending;
    });
    this.dataSource.data = filterPandingList;
    this.applyFilter({ value: this.searchTerm });
  }
  async RejectLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ''
    };
    const filterRejectedList = this.allLeave.filter((x) => {
      return x.approval === LeaveStatus.Rejected;
    });
    this.dataSource.data = filterRejectedList;
  }
  async ApproveLeave() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ''
    };

    const filterPandingList = this.allLeave.filter((x) => {
      return x.approval === LeaveStatus.Approved;
    });
    this.dataSource.data = filterPandingList;
    this.applyFilter({ value: this.searchTerm });
  }

  async WorkFromHome() {
    const filter = this.allLeave.filter((x) => {
      return x.leaveType === LeaveType.WorkFromHome;
    });
    this.dataSource.data = filter;
    this.applyFilter({ value: this.searchTerm });
  }
  openModal() {
    const dialogRef = this.dialog.open(ApplyLeaveByUserComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-modal',

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed with result:', result);
    });
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
  approval: number;
  reason: string;
  leaveType: number;
  Remark: string;
}
