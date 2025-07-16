import { ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import ApprovalfromPopUpComponent from '../approvalfrom-pop-up/approvalfrom-pop-up.component';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NgIf, NgFor } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InsurancePerson, userRole } from 'src/app/assets.model';
import { environment } from 'src/environments/environment';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'src/app/service/common/common.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AttendanceLogComponent } from '../atteandace/attendance-log/attendance-log.component';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { ToastType } from '../../models/models';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Designation } from 'src/app/service/common/common.model';

export enum AttendanceStatus {
  Present = 0,
  Absent = 1,
  Leave = 2,
  WeeklyOff = 3,
  Holiday = 4,
  HalfdayLeave = 5
}

export enum adminAttendance {
  empId = 'empId',
  Name = 'Name',
  Designation = 'Designation',
  InTime = 'InTime',
  OutTime = 'OutTime',
  Date = 'Date',
  Status = 'Status',
  WorkDurection = 'WorkDurection',
  BreakDurection = 'BreakDurection',
  Break = 'Break',
  Action = 'Action'
}

export const attendanceStatusLable = {
  Present: '0',
  Absent: '1',
  Leave: '2',
  WeeklyOff: '3',
  Holiday: '4',
  HalfdayLeave: '5'
};

@Component({
  selector: 'app-admin-attendance-view',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    NgIf,
    NgFor,
    SharedModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin-attendance-view.component.html',
  styleUrls: ['./admin-attendance-view.component.scss'],
  providers: [DatePipe]
})
export default class AdminAttendanceViewComponent implements OnInit {
  loading: boolean = false;
  personId: { personID: string };
  designationId: string = '';
  PersonId: string = '';
  timeCardForm: FormGroup;
  current = new Date();
  public userRole: Array<userRole> = [];
  public allAdminAttendancelist: any;
  public attendanceData: any;
  public deptId: string;
  firstDate = moment(new Date()).subtract(14, 'days').toDate();
  lastDate = new Date();
  public allDepartment: any;
  public filteredOptions: any;
  InOutTime: any;
  view: string = 'list';
  dateFormat: string = localStorage.getItem('Date_Format');
  public statusData: any[] = [
    { status: 'Present', value: 1 },
    { status: 'Absent', value: 2 },
    { status: 'WFH', value: 3 }
  ];
  public adminAttendanceRecord: Array<any>;
  public columnNames: string[] = [];
  Designation: Array<Designation> = [];
  public tableData: Array<Designation> = [];
  public getAllEmplyeeList: InsurancePerson[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  attachmentUrl: string = environment.apiUrl.replace('api/', '');
  templateUrl: string = 'wwwroot\\AttendanceDetail\\AttendanceDetails.xlsx';

  @ViewChild('file') file: ElementRef;
  selectedFile: any;
  extentions = ['.xls', '.xlsx', '.csv'];

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private api: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _commonservice: CommonService,
    private _commonService: CommonService,
    private date: DatePipe,
    private datepipe: DatePipe,
    private zone: NgZone // Add NgZone
  ) {
    this.timeCardForm = this.fb.group({
      firstDate: ['', Validators.required],
      lastDate: ['', Validators.required],
      departmentId: [''],
      DesignationId: [''],
      personId: ['']
    });
  }

  async ngOnInit() { 
    this.getAllDepartment();
    this.getAllperson();
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    const datePipe = new DatePipe('en-US');
    this.cdr.detectChanges(); 
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'Attendence';
      });
    }
    this.onApply();
    this.timeCardForm.patchValue({
      firstDate: new Date(),
      lastDate: new Date()
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  displayedColumns: string[] = Object.values(adminAttendance);
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  clickedRows = new Set<PeriodicElement>();

  openPopup(): void {
    const dialogRef = this.dialog.open(ApprovalfromPopUpComponent, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
    });
  }

  updateDateRangestartdate(value: any) {
    this.timeCardForm.get('firstDate').setValue(value);
  }

  updateDateRangeendDate(value: any) {
    this.timeCardForm.get('lastDate').setValue(value);
  }

  getAllDepartment() {
    this._commonservice.get('Department').subscribe((res) => {
      this.allDepartment = res;
    });
  }
  getAllDesignation() {
    this.loading = true;
    this._commonService.get('Designation').subscribe((res) => {
      this.loading = false;
      this.tableData = res;
      this.dataSource = new MatTableDataSource<Designation>(this.tableData);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    });
  }

  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.PersonId = '';
    this.Designation = [];
    this.getAllEmplyeeList = [];
    this.getAllperson(this.deptId,'')

    if (!this.deptId) return;

    this._commonservice.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.PersonId = '';
    this.getAllEmplyeeList = [];

  this.getAllperson('', this.designationId) ;

  }
  
  getAllperson(deptId?: string, designationId?: string) {
        deptId = deptId ?? ''
    designationId = designationId ?? ''
     this.api.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
        this.getAllEmplyeeList = res.sort((a, b) => a.firstName.localeCompare(b.firstName)); 
      });
  }

  onApply() {
    this.getAllAdminAttendance();
  }

  onReset() {
    this.timeCardForm.get(`firstDate`).setValue(this.firstDate);
    this.timeCardForm.get(`lastDate`).setValue(this.lastDate);
    this.timeCardForm.get(`departmentId`).setValue('');
    this.timeCardForm.get(`personId`).setValue('');
    this.onApply();
    this.deptId = '';
    this.designationId = '';
    this.PersonId = '';
    this.Designation = [];
    this.getAllEmplyeeList = [];
  }

  getAllAdminAttendance() {
    this.loading = true;
    if (this.view == 'list') {
      let payload = {
        personId: this.timeCardForm.value.personId,
        firstDate: this.date.transform(this.timeCardForm.value.firstDate, 'yyyy-MM-dd'),
        lastDate: this.date.transform(this.timeCardForm.value.lastDate, 'yyyy-MM-dd'),
        departmentId: this.timeCardForm.value.departmentId
      };
      this.displayedColumns = Object.values(adminAttendance);

      this._commonservice.post(`Attendance/adminAttendance`, payload).subscribe((res) => {
        this.loading = false;
        this.allAdminAttendancelist = res;
        this.attendanceData = res;
        this.dataSource = new MatTableDataSource<any>(this.allAdminAttendancelist);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 300);
      });
    } else if (this.view == 'card') {
      let payload = {
        personId: this.timeCardForm.value?.personId,
        StartDate: this.date.transform(this.timeCardForm.value.firstDate, 'yyyy-MM-dd'),
        EndDate: this.date.transform(this.timeCardForm.value.lastDate, 'yyyy-MM-dd'),
        departmentId: this.timeCardForm.value?.departmentId
      };

      this._commonservice.post(`Attendance/employeeAttendance`, payload).subscribe((res) => {
        this.adminAttendanceRecord = res;
        this.adminAttendanceRecord.forEach((record) => {
          record.totalPresent = this.calculateTotalPresent(record);
          record.totalAbsent = this.calculateTotalAbsent(record);
        });
        this.dataSource = new MatTableDataSource<any>(this.adminAttendanceRecord);

        this.columnNames = Object.keys(this.adminAttendanceRecord[0]);
        const index = this.columnNames.indexOf('personName');
        if (index > -1) {
          this.columnNames.splice(index, 1);
        }
        this.columnNames.unshift('personName');
        // Insert totalPresent and totalAbsent after Employee Name
        const personNameIndex = this.columnNames.indexOf('personName');
        this.columnNames.splice(personNameIndex + 1, 0, 'totalPresent', 'totalAbsent');
        this.displayedColumns = this.columnNames;
        this.columnNames.splice(-2);

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 300);
      });
    }
  }

  applyStatusFilter(selectedValue: any) {
    const selectedStatus = this.statusData.find((item) => item.value === selectedValue)?.status;
    if (!selectedStatus) {
      this.dataSource = new MatTableDataSource<any>(this.attendanceData);
    } else {
      const filteredData = this.attendanceData.filter((item) => item.status === selectedStatus);
      this.dataSource = new MatTableDataSource<any>(filteredData);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  calculateTotalPresent(record: any): number {
    return Object.values(record).filter((value) => value === 1).length;
  }

  calculateTotalAbsent(record: any): number {
    return Object.values(record).filter((value) => value === 0).length;
  }

  transformDate(data) {
    const columnNameMap = {
      personName: 'Employee Name'
    };
    if (columnNameMap[data]) {
      return columnNameMap[data] || data;
    }
    if (data) {
      const header = data.split('-').pop();
      return header;
    }
    return data;
  }
  getColumnName(element) {
    switch (element) {
      case 0:
        return `0`;
      case 1:
        return `1`;
      default:
        return '0';
    }
  }

  viewAttendanceLog(element: any) {
    let dialogRef!: any;
    this._commonservice.get(`Attendance/attendanceDetails/${element}`).subscribe((x) => {
      this.InOutTime = x;
      dialogRef = this.dialog.open(AttendanceLogComponent, {
        data: {
          data: this.InOutTime,
          id: element
        }
      });
    });
  }
  async onFileSelect(e) {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0];
      const formData = new FormData();
      formData.append('file', selectedFile);
      await new Promise((resolve) => setTimeout(resolve, 0));
      await this.uploadFile(formData);
    }
  }

  async uploadFile(formData: FormData): Promise<any> {
    const form = {
      formData: formData,
      personID: this.personId.personID
    };
    this.loading = true;
    try {
      const response = await this.apiService.AttendanceAddData(form);

      if (response.statusCode === 200) {
        const getattendacedata = await this.apiService.importDataGet();
        this.loading = false;

        getattendacedata.map((x) => {
          const rawDate = x.date;
          const intime = x.inTime;
          const OutTime = x.outTime;
          const empName = x.empName;

          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(rawDate, 'dd-MM-yyyy');
          const formateIntime = datePipe.transform(intime, 'h:mm a');
          const formateOutTime = datePipe.transform(OutTime, 'h:mm a');

          function getHalfDayTypeLabel(value: number): string {
            return attendanceStatusLable[AttendanceStatus[value]];
          }
          const leaveTypeLabel = Object.keys(AttendanceStatus).find((key) => AttendanceStatus[key] === x.status);
          const attendanceenum = getHalfDayTypeLabel(x.status);
          x.status = leaveTypeLabel;
          x.inTime = formateIntime;
          x.date = formattedDate;
          x.outTime = formateOutTime;
          x.empName = empName;

          this.dataSource = new MatTableDataSource(getattendacedata);
        });
      }
    } catch (error) {
      this.toastr.error('File upload failed', 'Error');
      this.loading = false;
    }
  }

  async updateDate(selectedDate: Date | null) {
    if (selectedDate) {
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(selectedDate, 'dd-MM-yyyy');

      try {
        const response = await this.apiService.AttendanceAddDataGet();
        if (Array.isArray(response) && response.length > 0) {
          const matchingDateRecords = response.filter((x) => {
            const apiDate = datePipe.transform(x.date, 'dd-MM-yyyy');
            return apiDate === formattedDate;
          });

          if (matchingDateRecords.length > 0) {
            matchingDateRecords.forEach((x) => {
              const rawDate = x.date;
              const intime = x.inTime;
              const OutTime = x.outTime;

              const formattedDate = datePipe.transform(rawDate, 'dd-MM-yyyy');
              const formateIntime = datePipe.transform(intime, 'h:mm a');
              const formateOutTime = datePipe.transform(OutTime, 'h:mm a');

              function getHalfDayTypeLabel(value: number): string {
                return attendanceStatusLable[AttendanceStatus[value]];
              }

              const leaveTypeLabel = Object.keys(AttendanceStatus).find((key) => AttendanceStatus[key] === x.status);
              const attendanceenum = getHalfDayTypeLabel(x.status);
              x.status = leaveTypeLabel;
              x.inTime = formateIntime;
              x.date = formattedDate;
              x.outTime = formateOutTime;
            });

            this.dataSource = new MatTableDataSource(matchingDateRecords);
          } else {
            this.dataSource = new MatTableDataSource([]); // Set empty data source
          }
        } else {
          this.dataSource = new MatTableDataSource([]); // Set empty data source
        }
      } catch (error) {}
    }
  }

  async goToPrevious() {
    const currentDate = this.timeCardForm.get('date').value;
    const newDate = moment(currentDate).subtract(1, 'days').toDate();
    this.timeCardForm.get('date').setValue(newDate);
    this.cdr.detectChanges();
    await this.updateDate(newDate);
  }

  async goTonext() {
    const currentDate = this.timeCardForm.get('date').value;
    const newDate = moment(currentDate).add(1, 'days').toDate();
    this.timeCardForm.get('date').setValue(newDate);
    this.cdr.detectChanges();
    await this.updateDate(newDate);
  }

  exportToExcel() {
    const fileName = 'attendance_logs.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AttendanceLogs');
    XLSX.writeFile(wb, fileName);
  }

  downloadTemlate() {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', `${environment.apiUrl.replace('api/', '')}template/Attendance (1).xlsx`);
    link.setAttribute('download', `Attendance.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map((row) => {
      const filteredRow = {};
      this.displayedColumns?.forEach((column) => {
        filteredRow['empId'] = row?.employeeId;
        filteredRow['Name'] = row?.name;
        filteredRow['Designation'] = row?.designation_name;
        filteredRow['InTime'] = this.transform(row?.checkin_time);
        filteredRow['OutTime'] = this.transform(row?.checkout_time);
        filteredRow['Date'] = row?.date;
        filteredRow['Status'] = row?.status;
        filteredRow['WorkDurection'] = row?.work_duration;
        filteredRow['BreakDurection'] = row?.break_duration;
        filteredRow['Break'] = row?.number_of_breaks;
      });
      return filteredRow;
    });
    this._commonservice.exportAsExcelFile(filteredData, 'AdminAttendanceList', this.displayedColumns);
  }

  public uploadData(event) {
    if (event.target.files.length > 0) {
      if (!this.extentions.some((x) => event.target.files[0].name.includes(x))) {
        this.file.nativeElement.value = '';
      }
      (err) => {};
      const file = event.target.files[0];
      this.selectedFile = file;
      this.onImport();
      this.file.nativeElement.value = null;
    }
  }
  onImport() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this._commonservice.post('Attendance/import', formData).subscribe(
      (res) => {
        this._commonservice.showToast('Attendance imported successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.onApply();
      },
      (err) => {
        this._commonservice.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }

  onsreachFilter(e) {
    const filterValue = e.target.value;
    filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.employeeId ? a.employeeId : null;
      const personCodeB = b.employeeId ? b.employeeId : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }
}
export interface PeriodicElement {
  EmployeId: string;
  Name: string;
  designation: string;
  InTime: number;
  OutTime: number;
  Date: number;
  Status: string;
  WorkDurection: number;
  BreakDurection: number;
  Break: number;
}
