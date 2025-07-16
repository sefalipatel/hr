import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { userRole } from 'src/app/assets.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { LeaveRequestTypeLable } from '../admine-request-approval/admine-request-approval.component';
import { ToastType } from '../../models/models';
import { MatSort } from '@angular/material/sort';
export enum LeaveStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export const LeaveStatusLable = {
  [LeaveStatus.Pending]: 'Pending',
  [LeaveStatus.Approved]: 'Approved',
  [LeaveStatus.Rejected]: 'Rejected',
};
enum UserOvertime { 
  otDate = 'otDate',
  otHour = 'otHour',
  description = 'description',
  status = 'status',
  approvedBy = 'approvedBy',
  actions = 'actions',
}
@Component({
  selector: 'app-user-overtime-request',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './user-overtime-request.component.html',
  styleUrls: ['./user-overtime-request.component.scss']
})
export class UserOvertimeRequestComponent implements OnInit {

  personId: { personID: string }
  requestDate: number
  loading : boolean = false
  public userRole: Array<userRole> = [];
  public tableData: any[] = [];
  public searchDataValue = '';
  displayedColumns: string[] = Object.values(UserOvertime);
  dataSource = new MatTableDataSource<any>();
  dateFormat:string = localStorage.getItem('Date_Format');
  timeFormat:string = localStorage.getItem('Time_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( 
    private sweetlalert: SweetalertService,
    private _commonService:CommonService,
    public dialog: MatDialog,) {
  }
  
  ngOnInit(): void {
    this.getAllUserOvertime();
  }

  getAllUserOvertime() {
    this.loading = true
    this._commonService.get(`Overtime/OvertimeByEmployee`).subscribe(res => {
      this.loading = false
      this.dataSource = new MatTableDataSource<any>(res?.value);
      this.tableData = res?.value;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  getStatusLeaveTypeLabel(status: number): string {
    return LeaveRequestTypeLable[status] || 'Unknown';
  }

  async deleted(id: string): Promise<void> {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Overtime/${id}`).subscribe(res => {

        this.dataSource.data = this.dataSource.data.filter((element) => element.id !== id);
        this._commonService.showToast('Overtime Request deleted', ToastType.SUCCESS, ToastType.SUCCESS)
      })

    }
  }

  searchRecord(value: string) {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return item.description?.toLowerCase().includes(value.toLowerCase()) ||
          item?.otDate?.toString().includes(value.toString()) ||
          item?.otHour?.toString().includes(value.toString()) ||
          item?.personName?.toLowerCase().includes(value.toLowerCase()) ||
          this.getStatusLabel(item?.status).toLowerCase().includes(value.toLowerCase()) ||
          item?.approvedBy?.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

}
