import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { Designation } from 'src/app/service/common/common.model';

export enum employeeSalaryEnum {
  employeeCode = 'employeeCode',
  employeeName = 'employeeName',
  annualCTC = 'annualCTC',
  actualSalary = 'actualSalary',
  month = 'month',
  paidSalary = 'paidSalary',
  cutLeave = 'cutLeave',
  carryForwardLeave = 'carryForwardLeave',
  action = 'action'
}
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
  selector: 'app-employee-salary-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
    MaterialModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './employee-salary-list.component.html',
  styleUrls: ['./employee-salary-list.component.scss']
})
export class EmployeeSalaryListComponent implements OnInit {
  public selectedYear: number;
  public selectedMonth: number;
  public years: number[] = [];
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
  defaultYear: any;
  defaultMonth: any;
  departmentID: any;
  public personID: any;
  loading: boolean = false;

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  public allEmployeeSalaryList: any;
  public columnNames: string[] = [];
  public filteredData: any[] = [];
  public departmentList: any[] = [];
  public employeeList: any[] = [];
  Designation: Array<Designation> = [];
  orgId: string;
  deptId: string = '';
  designationId: string = '';

  constructor(
    private commonService: CommonService,
    private _commonService: CommonService,
    private router: Router
  ) {
    this.displayedColumns = Object.values(employeeSalaryEnum);
  }

  ngOnInit(): void {
    this.orgId = localStorage.getItem('orgId');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth();
    this.selectedYear = currentDate.getFullYear();

    this.defaultYear = currentDate.getFullYear();
    this.defaultMonth = currentDate.getMonth();
    this.getAllperson();
    this.getEmployeeSalary();
    this.getAllDepartment();
  }

  async onYearSelected(year) {
    this.selectedYear = year;
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month;
  }

  getAllDepartment() {
    this.loading = true;
    this.commonService.get(`Department`).subscribe((res) => {
      this.loading = false;
      this.departmentList = res;
    });
  }
  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this._commonService.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.employeeList = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });
  }

  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.personID = '';
    this.Designation = [];
    this.employeeList = [];
    this.getAllperson(this.deptId, '');

    if (!this.departmentID) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.departmentID}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.personID = '';
    this.employeeList = [];

    this.getAllperson('', this.designationId);
  }

  reset() {
    this.selectedYear = this.defaultYear;
    this.selectedMonth = this.defaultMonth;
    this.departmentID = '';
    this.personID = '';
    this.designationId = '';
    this.getEmployeeSalary();
  }

  applyBtn() {
    if (this.selectedYear && this.selectedMonth) {
      this.getEmployeeSalary();
    }
  }

  // first letter capital and space between word
  transformColumnName(name: string): string {
    // Convert camelCase to space-separated words
    return name
      .replace(/([A-Z])/g, ' $1') // insert a space before all capitals
      .replace(/^./, function (str) {
        return str.toUpperCase();
      }); // capitalize the first character
  }

  getEmployeeSalary() {
    this.displayedColumns = Object.values(employeeSalaryEnum);
    this.personID = this.personID ?? '';
    this.commonService
      .get(`Payroll/salary?year=${this.selectedYear}&month=${this.selectedMonth}&personId=${this.personID}`)
      .subscribe((res) => {
        this.allEmployeeSalaryList = res;
        this.dataSource = new MatTableDataSource<any>(this.allEmployeeSalaryList);
        this.columnNames = Object.keys(this.allEmployeeSalaryList[0]).filter(
          (key) =>
            key !== 'employeeName' &&
            key !== 'employeeId' &&
            key !== 'employeeCode' &&
            key !== 'annualCTC' &&
            key !== 'actualSalary' &&
            key !== 'month' &&
            key !== 'paidSalary' &&
            key !== 'cutLeave' &&
            key !== 'carryForwardLeave'
        );
        this.displayedColumns.pop();
        this.displayedColumns.push(...this.columnNames);
        this.displayedColumns.push('action');
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 300);
      });
  }

  editSalayDetail(id, month) {
    this.router.navigate([`employee-payroll-details/payroll-form/${id}/${month}`]);
  }
  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.person ? a.person.personCode : null;
      const personCodeB = b.person ? b.person.personCode : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }
  AddSalary() {
    this.commonService.post(`Payroll/salary?organizationId=${this.orgId}`, {}).subscribe(
      (x) => {
        if (x) {
          this.commonService.showToast('Add Salary Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      },
      (error) => {
        this.commonService.showToast('something went wrong error.', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }
}
