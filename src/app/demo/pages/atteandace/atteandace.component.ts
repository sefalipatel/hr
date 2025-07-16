import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import ApprovalfromPopUpComponent from '../approvalfrom-pop-up/approvalfrom-pop-up.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonService } from 'src/app/service/common/common.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AttendanceLogComponent } from './attendance-log/attendance-log.component';
import { AddOverTimeComponent } from './attendance-log/add-over-time/add-over-time.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AbsentPresentApproveFormComponent } from '../absent-present-approve-form/absent-present-approve-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddWfhCompoffComponent } from './attendance-log/add-wfh-compoff/add-wfh-compoff.component';

@Component({
  selector: 'app-atteandace',
  standalone: true,
  templateUrl: './atteandace.component.html',
  styleUrls: ['./atteandace.component.scss'],
  imports: [
    MatTableModule,
    NgIf,
    DatePipe,
    NgFor,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    DatePipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  providers: [
    DatePipe
    // { provide:  MAT_DATE_FORMATS, useValue:MAT_DATE_FORMATS }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export default class AtteandaceComponent implements OnInit, OnDestroy {
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
  dateRangeForm: FormGroup;
  dateRange: { start: Date; end: Date };
  endDate = new Date();
  startDate = moment(new Date()).subtract(14, 'days').toDate();
  public userRole: any[] = [];
  Employee: any;
  InOutTime: any;
  showTable: boolean = false;
  expandedElement: PeriodicElement | null;
  totalnumberPresant: any;
  years: number[] = [];
  selectedYear: number;
  loading: boolean = false;

  requestId: string;
  attendaanceID: string;
  totalnumberAbsent: any;
  dateFormat: string = localStorage.getItem('Date_Format');

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private api: CommonService
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  displayedColumns: string[] = [
    'date',
    'Status',
    'InTime',
    'OutTime',
    'WorkDurection',
    'BreakDurection',
    'TotalDurection',
    'Break',
    'Action'
  ];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource([]);
  clickedRows = new Set<PeriodicElement>();

  openPopup(element): void {
    const elementData = element;
    const date = element.date;
    const id = element.id;
    const requestId = this.requestId;
    const Status = element.status;

    const dialogRef = this.dialog.open(ApprovalfromPopUpComponent, {
      width: '800px',
      data: { date, id, Status, elementData }
    });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
    });
  }

  updateDateRangestartdate(value: any) {
    this.dateRangeForm.get('startDate').setValue(value);
  }
  updateDateRangeendDate(value: any) {
    this.dateRangeForm.get('endDate').setValue(value);
  }

  resetButton() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getAttendance();
  }

  async ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.dateRangeForm.patchValue({
      startDate: moment(this.endDate).subtract(14, 'days').toDate(),
      endDate: this.endDate
    });
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const form = {
      personID: this.personId.personID
    };
    this.getAttendance();
  }

  getAttendance() {
    this.loading = true;
    this.api.get(`Attendance/attendance?year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((response) => {
      this.loading = false;
      response.table = response.table.map((x) => {
        return {
          ...x,
          totalDuration: x.work_duration || x.break_duration ? this.calculateTotalTime(x.work_duration, x.break_duration) : null
        };
      });
      this.dataSource = new MatTableDataSource(response.table);
      this.totalnumberPresant = response?.table1[0]?.total_PresentDay || 0;
      this.totalnumberAbsent = response?.table2[0]?.total_AbsentDay || 0;
      let userPermissions = JSON.parse(localStorage.getItem('userRole'));
      if (userPermissions?.accessPermission?.length) {
        this.userRole = userPermissions.accessPermission.filter((item) => item?.module?.module === 'Attendance');
      }
    });
  }
  calculateTotalTime(workDuration: string, breakDuration: string): string {
    const timeToSeconds = (time: string): number => {
      if (!time) return 0; // Handle null or undefined
      const [hours, minutes, seconds] = time.split(':').map(Number);
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    };
    const totalSeconds = timeToSeconds(workDuration) + timeToSeconds(breakDuration);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60); 
    return `${this.pad(hours)}:${this.pad(minutes)}`;
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  employeeDetails(element) {
    this.api.get(`Attendance/attendanceDetails/${element.id}`).subscribe((x) => {
      this.InOutTime = x;
    });
  }

  viewAttendanceLog(element: any) {
    let dialogRef!: any;
    this.api.get(`Attendance/attendanceDetails/${element}`).subscribe((x) => {
      this.InOutTime = x;
      dialogRef = this.dialog.open(AttendanceLogComponent, {
        data: {
          data: this.InOutTime,
          id: element
        }
      });
    });
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
  onMonthSelected(Month) {
    this.selectedMonth = Month;
  }
  async onYearSelected(year) {
    this.selectedYear = year;
  }
  exportJson(): void {
    const filteredData = this.dataSource.data.map((row) => {
      const filteredRow = {};
      this.displayedColumns?.forEach((column) => {
        if (row.hasOwnProperty(column)) {
          filteredRow['date'] = row[column];
          filteredRow['Status'] = row?.status;
          filteredRow['InTime'] = this.transform(row?.checkin_time);
          filteredRow['OutTime'] = this.transform(row?.checkout_time);
          filteredRow['WorkDurection'] = row?.work_duration;
          filteredRow['BreakDurection'] = row?.break_duration;
          filteredRow['Break'] = row?.number_of_breaks;
        }
      });
      return filteredRow;
    });
    this.api.exportAsExcelFile(filteredData, 'AttendanceList', this.displayedColumns);
  }

  overTimePopup(element) {
    const date = element.date;
    const id = element.id;
    const dialogRef = this.dialog.open(AddOverTimeComponent, {
      width: '800px',
      data: { date, id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
    });
  }

  WfhCompoffForm(element: any): void {
    this.dialog.open(AddWfhCompoffComponent, {
      width: '800px',
      data: {
        date: moment(new Date(element.date)).format('YYYY-MM-DD'),
        id: element.id,
        leaveType: 'WorkFromHome'
      }
    });
  }

  CompOffForm(element: any): void {
    this.dialog.open(AddWfhCompoffComponent, {
      width: '800px',
      data: {
        date: moment(new Date(element.date)).format('YYYY-MM-DD'),
        id: element.id,
        leaveType: 'CompOff'
      }
    });
  }

  applyButton() {
    this.getAttendance();
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

  absentToPresentForm(absentDate) {
    let dialogRef!: any;
    dialogRef = this.dialog.open(AbsentPresentApproveFormComponent, {
      data: {
        date: absentDate
      }
    });
  }
}
export interface PeriodicElement {
  Date: number;
  Status: string;
  InTime: number;
  checkin_time: any;
  checkout_time: any;
  break_duration: any;
  number_of_breaks: any;
  status: any;
  OutTime: number;
  work_duration: number;
  BreakDurection: number;
  Break: number;
}
