import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
export enum NotificationType {
  Expense = 0,
  Loan = 1,
  CompanyPolicy = 2,
  ProjectAssign = 3,
  EmployeeInsurance = 4,
  UserLeave = 5,
  UserRequest = 6,
  AssetsAllocation = 7,
  AssetCarryToHome = 8,
  TicketAssign = 9,
  Suggestion = 10,
  TaskAssign = 11,
  Advance = 12,
  AdminLeaveRequest = 13
}

@Component({
  selector: 'app-notification-history',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './notification-history.component.html',
  styleUrls: ['./notification-history.component.scss']
})
export class NotificationHistoryComponent implements OnInit, AfterViewInit {

  //  NotificationType = NotificationType; 
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'title', 'type', 'createdDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dateFormat: string = localStorage.getItem('Date_Format');

  constructor(
    private _commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
   this.getAllNotification()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getNotificationTypeName(type: number): string {
    return NotificationType[type];
  }

  getAllNotification() {
    this._commonService.get(`Notification/GetHistory`).subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }
}
