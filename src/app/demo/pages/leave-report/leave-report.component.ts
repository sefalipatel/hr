import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { userRole } from 'src/app/assets.model';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastType } from '../../models/models';
import { Designation } from 'src/app/service/common/common.model';
export enum MonthEnum {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12
}
@Component({
  selector: 'app-leave-report',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './leave-report.component.html',
  styleUrls: ['./leave-report.component.scss']
})
export class LeaveReportComponent implements OnInit {
  years: number[] = [];
  monthList = MonthEnum;
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
  selectedYear: number;
  loading: boolean = false;
  public userRole: Array<userRole> = [];
  displayedColumns: string[] = ['employeeName', 'month', 'departmentName', 'carryforwardLeave', 'totalLeave', 'takenLeave', 'pendingLeave'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  Designation: Array<Designation> = [];

  public departmentList: any[] = [];
  public employeeList: any[] = [];
  public personID: any;
  public departmentID: any;
  designationId: any = '';
  personId: string = '';
  deptId: string = '';
  dateFormat: string = localStorage.getItem('Date_Format');

  constructor(
    private _commonService: CommonService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.monthYearCalculation();
    this.getAllDepartment();
    this.getAllLeaveReport();
    this.getAllperson();
  }

  public monthYearCalculation() {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
  }

  public onYearSelected(year) {
    this.selectedYear = year;
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month;
  }

  getAllDepartment() {
    this._commonService.get(`Department`).subscribe((res) => {
      this.departmentList = res;
    });
  }

  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.personId = '';
    this.Designation = [];
    this.employeeList = [];
    this.departmentID = this.deptId;
    this.getAllperson(this.deptId, '');

    if (!this.deptId) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.personId = '';
    this.employeeList = [];
    this.getAllperson('', this.designationId) ;
  }

  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this._commonService.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.employeeList = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });
  }

  getAllLeaveReport() {
    this.loading = true;
    this.personID = this.personID ?? '';
    this.departmentID = this.departmentID ?? '';
    this._commonService
      .get(
        `EmployeeLeave/LeaveReport?personId=${this.personID}&departmentId=${this.departmentID}&year=${this.selectedYear}&month=${this.selectedMonth}`
      )
      .subscribe(
        (res) => {
          this.loading = false;
          this.dataSource = new MatTableDataSource<any>(res?.table);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (err) => {
          this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
  }

  onReset() {
    this.monthYearCalculation();
    this.deptId = '';
    this.designationId = '';
    this.personID = '';
    this.getAllLeaveReport();
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map((row) => {
      const filteredRow = {};
      this.displayedColumns?.forEach((column) => {
        filteredRow['employeeName'] = row?.employeeName;
        filteredRow['requestDate'] = row?.requestDate;
        filteredRow['departmentName'] = row?.departmentName;
        filteredRow['carryforwardLeave'] = row?.carryforwardLeave;
        filteredRow['totalLeave'] = row?.totalLeave;
        filteredRow['takenLeave'] = row?.takenLeave;
        filteredRow['pendingLeave'] = row?.pendingLeave;
      });
      return filteredRow;
    });
    this._commonService.exportAsExcelFile(filteredData, 'LeaveReportList', this.displayedColumns);
  }
}
