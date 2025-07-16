import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MaterialModule } from 'src/app/theme/shared/material.module';
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
  selector: 'app-user-compoff-wfh-list',
  standalone: true,
  imports: [
    MatTableModule,
    MaterialModule,
    MatPaginatorModule,
    MatIconModule,
    DatePipe,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-compoff-wfh-list.component.html',
  styleUrls: ['./user-compoff-wfh-list.component.scss']
})
export class UserCompoffWfhListComponent implements OnInit {
  personId: { personID: string };
  requestDate: number;
  loading: boolean = false;
  public selectedRequestType: number | null = null;
  displayedColumns: string[] = ['name', 'requestType', 'Reason', 'leaveFile', 'approvedBy', 'weight', 'actions'];
  dataSource = new MatTableDataSource<any>();
  tableData: any[] = [];
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');
  searchDataValue = '';
  public getUserRequestData: any;
  attachmentURL: string = environment.apiUrl.replace('api/', '');
  imageUrl: string = this.attachmentURL;
  public selectedStatusType: Number | null = null;
  statusList = [
    { name: 'Pending', id: 0 },
    { name: 'Approved', id: 1 },
    { name: 'Rejected', id: 2 }
  ];
  requestTypeList = [
    { name: 'WorkFromHome', value: 1 },
    { name: 'CompOff', value: 2 }
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllUserRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  } 

  getAllUserRequests() {
    this.loading = true;
    this._commonService.get('EmployeeWFHCompOff/person').subscribe((res: any[]) => {
      this.loading = false;

      this.tableData = res.map((item, index) => {
        const relativePath = item.leaveFile ? item.leaveFile : null;
        const fileUrl = relativePath ? `${this.attachmentURL}${relativePath?.replace('wwwroot\\', '')}` : null;

        return {
          serialNumber: index + 1,
          wfhDate: item.wfhDate,
          leaveTypeName: item.leaveTypeName,
          leaveFile: fileUrl,
          approval: item.approval,
          approvedBy: item.approvedBy,
          reason: item.reason,
          id: item.id
        };
      });

      this.getUserRequestData = this.tableData;
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  filterLeaveType(type: number | null): void {
    this.selectedRequestType = type;
    let filteredData = this.getUserRequestData;

    if (type !== null) {
      filteredData = filteredData.filter((item) => item.leaveTypeName === this.convertLeaveType(type));
    }

    this.dataSource.data = filteredData;
  }

  convertLeaveType(value: number): string {
    const found = this.requestTypeList.find((x) => x.value === value);
    return found ? found.name : 'Unknown';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length === 0) {
    }
  }

  requestType(type: { name: any; value: any }) {
    this.selectedRequestType = type ? type.value : null;
    this.requestTypeFilter();
  }

  selectStatus(status: { name: string; id: number } | null): void {
    this.selectedStatusType = status ? status.id : null;
    this.requestTypeFilter();
  }
  
  requestTypeFilter(): void {
    let filteredData = this.getUserRequestData;
    if (this.selectedRequestType !== null) {
      filteredData = filteredData.filter((item) => {
        return item.requestType === this.selectedRequestType;
      });
    }
    if (this.selectedStatusType !== null) {
      filteredData = filteredData.filter((item) => item.approval === this.selectedStatusType);
    }
    this.dataSource.data = filteredData;
  } 
  async deleted(id: string, leaveTypeName: string): Promise<void> {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`EmployeeWFHCompOff/${id}`).subscribe((res) => {
        // Remove the deleted item from the data source
        this.dataSource.data = this.dataSource.data.filter((element) => element.id !== id);

        // Show a success message based on the leave type
        if (leaveTypeName === 'WorkFromHome') {
          this._commonService.showToast('Work From Home deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (leaveTypeName === 'CompOff') {
          this._commonService.showToast('CompOff deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else {
          this._commonService.showToast('Leave Request deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      });
    }
  } 
}
