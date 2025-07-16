import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from 'src/app/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { LeaveStatusLable } from '../userleave-details/userleave-details.component';
import { LeaveRequestTypeLable } from '../admine-request-approval/admine-request-approval.component';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import ApprovalfromPopUpComponent from '../approvalfrom-pop-up/approvalfrom-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { userRole } from 'src/app/assets.model';
import { MatIconModule } from '@angular/material/icon';
import { SweetalertService } from '../role-list/sweetalert.service';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { UserOvertimeRequestComponent } from '../user-overtime-request/user-overtime-request.component';
import { UserCompoffWfhListComponent } from '../user-compoff-wfh-list/user-compoff-wfh-list.component';
@Component({
  selector: 'app-user-request-list',
  standalone: true,
  imports: [
    MatTableModule,
    MaterialModule,
    MatPaginatorModule,
    MatIconModule,
    DatePipe,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    UserOvertimeRequestComponent,
    UserCompoffWfhListComponent
  ],
  templateUrl: './user-request-list.component.html',
  styleUrls: ['./user-request-list.component.scss']
})
export default class UserRequestListComponent implements OnInit {
  personId: { personID: string };
  requestDate: number;
  loading: boolean = false;
  public selectedRequestType: string | null = null;
  public userRole: Array<userRole> = [];
  displayedColumns: string[] = Object.values(MyEnum);
  dataSource = new MatTableDataSource<PeriodicElement>();
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  requestTypeList = [
    { name: 'Add', value: 0 },
    { name: 'Update', value: 1 }
  ];
  public getUserRequestData: any;

  constructor(
    private apiservice: ApiService,
    private router: Router,
    private sweetlalert: SweetalertService,
    private api: CommonService,
    public dialog: MatDialog
  ) {}
  selectedIndex: number = 0;
  onTabChange(event: any): void {
    this.selectedIndex = event.index;
  }
  async ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.loading = true;
    const fromdata = {
      personID: this.personId.personID
    };
    try {
      const response = await this.apiservice.userRequestGetData(fromdata);
      this.getUserRequestData = response?.data;
      this.loading = false;
      response.data.forEach((element, index) => {
        element.serialNumber = index + 1;
      });
      this.dataSource.data = response.data;
    } catch (err) {}
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'AttendenceLeave';
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  getStatusLeaveTypeLabel(status: number): string {
    return LeaveRequestTypeLable[status] || 'Unknown';
  }

  updateData(element) {
    const requestDate = element.requestDate;
    const requestid = element.id;
    const dialogRef = this.dialog.open(ApprovalfromPopUpComponent, {
      width: '800px',
      data: { requestDate, requestid }
    });
    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
    });
  }
  async deleted(id: string): Promise<void> {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      try {
        await this.apiservice.attendanceDelete(id);
        this.dataSource.data = this.dataSource.data.filter((element) => element.id !== id);
        this.api.showToast('Attendance Request deleted', ToastType.SUCCESS, ToastType.SUCCESS);
      } catch (error) {}
    }
  }

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    const customFilter = (data: PeriodicElement, filter: string): boolean => {
      return (
        (this.getStatusLabel(data.status)?.toLowerCase() || '').includes(filter) ||
        (data.reason?.toLowerCase() || '').includes(filter) ||
        (this.getStatusLeaveTypeLabel(data.requestType)?.toLowerCase() || '').includes(filter)
      );
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filter;
    if (this.dataSource.filteredData.length === 0) {
    }
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
    let filteredData = this.getUserRequestData;
    // Filter request type
    if (this.selectedRequestType !== null) {
      filteredData = filteredData.filter((item) => item.requestType === this.selectedRequestType);
    }
    this.dataSource.data = filteredData;
  }
}

export interface PeriodicElement {
  name: string;
  requestType: number;
  position: number;
  weight: number;
  symbol: string;
  id: any;
  status: number;
  reason: string;
  InTime: string;
  OutTime: string;
}

enum MyEnum {
  Position = 'position',
  Name = 'name',
  checkInOutTime = 'checkInOutTime',
  requestType = 'requestType',
  actualTime = 'actualTime',
  Reason = 'Reason',
  Weight = 'weight',
  Actions = 'actions'
}
