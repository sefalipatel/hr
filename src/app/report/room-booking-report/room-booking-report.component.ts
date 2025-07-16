import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { assetsAssignment } from 'src/app/assets.model';
import { userRole } from 'src/app/assets.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export enum employeeSalaryEnum {
  reason = 'reason',
  name = "name",
  firstName = "firstName",
  startDate = "startDate",
  endDate = "endDate"
}

@Component({
  selector: 'app-room-booking-report',
  standalone: true,
  imports: [CommonModule, SharedModule,MatProgressSpinnerModule, MatTableModule, MatSelectModule, MatInputModule, FormsModule, MatPaginatorModule,MatIconModule, MatMenuModule],
  templateUrl: './room-booking-report.component.html',
  styleUrls: ['./room-booking-report.component.scss']
})
export class RoomBookingReportComponent {
  public selectedYear: number;
  public selectedMonth: number;
  public selectedroom: any;
  public selecteperson: any
  public sortConfig!: Sort
  Person: Array<assetsAssignment> = [];
  room: Array<any> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  personID = JSON.parse(localStorage.getItem('userInfo')).personID;
  public years: number[] = [];
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
  defaultYear: any;
  defaultMonth: any;
  indatetime: any
  selectedTime: string;
  loading: boolean = false;
  outTime: any
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  public userRole: Array<userRole> = [];
  constructor(private _commonService: CommonService, private datePipe: DatePipe,) {
    this.displayedColumns = Object.values(employeeSalaryEnum);
  }

  ngOnInit(): void {
    this.getAllEmployee();
    this.getroom();

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getAllRoom()
    this.defaultYear = currentDate.getFullYear();
    this.defaultMonth = currentDate.getMonth() - 0;
    this.getAllRoom()
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  async onYearSelected(year) {
    this.selectedYear = year
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month
  }
  onRoomSelected(Room) {
    this.personID = Room
  }
  onEmployeeName(Person) {
    this.selecteperson = Person
  }

  getroom() {
    this._commonService.get(`MeetingRoom`).subscribe(res => {
      this.room = res;
      this.dataSource.data = res?.value
    });
  }
  getAllEmployee() {
    this.loading = true;
    this._commonService.get(`Person/listemployee`).subscribe(res => {
      this.loading = false;
      this.Person = res;
      this.dataSource.data = res?.value
      this.Person.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }
  getAllRoom() {
    this._commonService.get(`Report/RoomBookingListByRoomId?meetingRoomId=${this.selectedroom ? this.selectedroom : ''}&year=${this.selectedYear}&month=${this.selectedMonth}&personId=${this.selecteperson ? this.selecteperson : ''}`).subscribe((res) => {
      setTimeout(() => {
      }, 300);
      let startDate
      let endDate
      let firstName
      const events = [];
      this.dataSource.data = res?.value
      res?.value?.map(x => {
        if (x?.startTime) {
          x.startDate = new Date(x.startDate).setMinutes(x.startTime?.toString().split(':')[1])
          x.startDate = (new Date(x.startDate).setHours(x.startTime?.toString().split(':')[0]))
          x.startDate = this.datePipe.transform(new Date(x.startDate), 'yyyy-MM-ddTHH:mm:ss');
        }
        if (x?.endTime) {
          x.endDate = new Date(x.endDate).setMinutes(x.endTime?.toString().split(':')[1])
          x.endDate = (new Date(x.endDate).setHours(x.endTime?.toString().split(':')[0]))
          x.endDate = this.datePipe.transform(new Date(x.endDate), 'yyyy-MM-ddTHH:mm:ss');
        }
        return x;
      })

    })
  }

  Reset() {
    this.selectedroom = '',
      this.selecteperson = ''
    this.getAllRoom()
  }
  onInTimeChange(value: any, controlName: string) {
    this.indatetime = value?.target?.value;
    var dt = new Date(this.indatetime);
    const newdate = dt.setUTCMinutes(dt.getUTCMinutes() + 30);
    const formattedDate = this.datePipe.transform(new Date(newdate), 'yyyy-MM-ddTHH:mm:ss');
  }
  onOutTimeChange(value: any) {
    this.outTime = value?.target?.value;
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow['employeeName'] = row?.personName;
          filteredRow['name'] = row?.meetingRoomName;
          filteredRow['startDate'] = row?.startDate;
          filteredRow['reason'] = row?.reason;
          filteredRow['endDate'] = row?.endDate;
          filteredRow[column] = row[column];

        }
      });
      return filteredRow;
    });
    this._commonService.exportAsExcelFile(filteredData, 'RoomBookingReportList', this.displayedColumns);
  }
}
