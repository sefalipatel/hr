import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { Subscription } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

export enum userAttendance {
  empId = 'empId',
  Name = 'Name',
  Department = "Department",
  InTime = 'InTime',
  OutTime = 'OutTime',
  WorkDurection = 'WorkDurection',
  BreakDurection = 'BreakDurection',
  Break = 'Break',
  Action = 'Action'
}
@Component({
  selector: 'app-person-checkin-out',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, MatSelectModule],
  templateUrl: './person-checkin-out.component.html',
  styleUrls: ['./person-checkin-out.component.scss']
})
export class PersonCheckinOutComponent implements OnInit {
  public alluserList: any;
  displayedColumns: string[] = Object.values(userAttendance);
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  dateFormat: string = localStorage.getItem('Date_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public showButton: boolean = false;
  public inOutStatus: any;
  public activeStatus: any;
  public timerSubscription: Subscription; 
  public lastStatus: string;
  public searchDataValue: '';
  loading: boolean = false

  constructor(private commonService: CommonService, private datepipe: DatePipe) {
    setTimeout(() => {
      this.showButton = true;
    }, 3000);
  }

  ngOnInit(): void {
    this.lastStatus = localStorage.getItem('LastCheckInOutStatus')
    this.getUserList();
  }

  getUserList() {
    this.loading = true
    this.commonService.get('Attendance/PersonDailyAttendance').subscribe(res => {
      this.loading = false
      this.alluserList = res?.value;

      this.dataSource = new MatTableDataSource<any>(this.alluserList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  transform(value: string): string {
    if (value) {
      let timeformat = localStorage.getItem('Time_Format') || 'hh:mm '; 
      const [hours, minutes, seconds] = value.split(':'); 
      const date = new Date();
      date.setHours(+hours, +minutes, +seconds || 0); 

      return this.datepipe.transform(date, timeformat) || '';
    }
    return '';
  }
  startCountdown(data) {
    this.showButton = false;
    const Status = true;
    let currentDateTime = new Date();
    let requesterId = JSON.parse(localStorage.getItem('userInfo')).personID;
    const activeStatus = 1
    let payload = { 
      status: true,
      CheckInOutDateTime: currentDateTime.toString()
    }

    this.commonService.post(`Attendance/CheckInOut/${data?.personId}/${activeStatus}`, payload).subscribe((res) => {
      if (res?.statusCode == 200) {
        this.searchDataValue = '';
        this.getUserList();
        setTimeout(() => {
          this.showButton = true;
        }, 3000);
        localStorage.removeItem('LastCheckInOutStatus');
        this.inOutStatus = true;
        localStorage.setItem('LastCheckInOutStatus', '1');
        this.commonService.showToast(res.value.inOutStatus + '. Button will be enable after 3 Seconds!', ToastType.SUCCESS, ToastType.SUCCESS);
      }
    }, (error) => {
      this.showButton = true;
    }
    );
  }

  OnCheckOutStatus(element) { 

    this.showButton = false;
    const Status = false;
    let currentDateTime = new Date();
    const activeStatus = 0;
    let requesterId = JSON.parse(localStorage.getItem('userInfo')).personID;
    let payload = { 
      status: false,
      CheckInOutDateTime: currentDateTime.toString()
    }
    this.commonService.post(`Attendance/CheckInOut/${element?.personId}/${activeStatus}`, payload).subscribe((res) => {
      if (res?.statusCode == 200) {
        this.searchDataValue = '';
        this.getUserList();
        setTimeout(() => {
          this.showButton = true;
        }, 3000);
        localStorage.removeItem('LastCheckInOutStatus');
        this.inOutStatus = false;
        localStorage.setItem('LastCheckInOutStatus', this.activeStatus);
        this.commonService.showToast(res.value.inOutStatus + '. Button will be enable after 3 Seconds!', ToastType.SUCCESS, ToastType.SUCCESS);
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
          this.timerSubscription = undefined;
        }
      }
    }, (error) => {
      this.showButton = true;
    }
    );
  }

  searchData(value) {
    if (value == '') {
      this.dataSource.data = this.alluserList;
    } else {
      this.dataSource.data = this.alluserList.filter(item => {
        return item?.employeeName.toLowerCase().includes(value.toLowerCase()) ||
          item?.personCode.toLowerCase().includes(value.toLowerCase());
      })
    }
  }

}
