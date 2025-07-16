import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { userRole } from 'src/app/assets.model';
import { userSalaryInfo } from 'src/app/demo/models/models';
import { AmountMaskingDirective } from '../../amount-masking/amount-masking.directive';
import {MatFormFieldModule  } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export enum employeeSalaryEnum {
  paidSalary = "paidSalary",
  cutLeaves = "cutLeaves",
  actualSalary = "actualSalary",
  month = "month",
  action = "action"
}
@Component({
  selector: 'app-salary-tab',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule, AmountMaskingDirective,MatFormFieldModule, MatInputModule, 
    MatIconModule,MatSelectModule,ReactiveFormsModule,FormsModule],
  templateUrl: './salary-tab.component.html',
  styleUrls: ['./salary-tab.component.scss']
})
export class SalaryTabComponent implements OnInit {
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
  selectedMonth: number
  public getAllEmplyeeSalary: any;
  public userRole: Array<userRole> = [];
  public columnNames: string[] = [];
  showIndex: { [key: number]: boolean } = {};
  actualSalaryIndex: { [key: number]: boolean } = {};
  @Input() requestId: any;
  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) { 
    }
  }
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile!: boolean;
  dataSource = new MatTableDataSource<userSalaryInfo>();
  displayedColumns: string[] = [];
  years: number[] = [];
  selectedYear: number;
  constructor(private route: ActivatedRoute,
    private _commonService: CommonService,
    private router: Router) {
    this.displayedColumns = Object.values(employeeSalaryEnum);
  }

  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
  
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.route.params.subscribe(async (params) => {
      this.requestId = params['id'] || this.requestId;
    });
    this.getEmployeeSalary();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Salary";
      })
    }
  }

  // first letter capital and space between word
  transformColumnName(name: string): string {
    // Convert camelCase to space-separated words
    return name
      .replace(/([A-Z])/g, ' $1') // insert a space before all caps
      .replace(/^./, function (str) { return str.toUpperCase(); }); // capitalize the first character
  }

  getEmployeeSalary() {
    this.displayedColumns = Object.values(employeeSalaryEnum);
    this.requestId = this.requestId ?? JSON.parse(localStorage.getItem('userInfo')).personID;
    
    this._commonService.get(`Payroll/salary/employeeId?employeeId=${this.requestId}&year=${this.selectedYear}`)
      .subscribe(res => {
        this.getAllEmplyeeSalary = res;
        this.getAllEmplyeeSalary.sort((a, b) => a.firstName?.localeCompare(b.firstName)); // Descending order
        this.dataSource = new MatTableDataSource<any>(this.getAllEmplyeeSalary);
        this.columnNames = Object.keys(this.getAllEmplyeeSalary[0]).filter(key => 
          key !== 'actualSalary' && key !== 'annualCTC' && key !== 'carryForwardLeave' && key !== 'cutLeave'
          && key !== 'employeeCode' && key !== 'employeeId' && key !== 'employeeName' && key !== 'paidSalary' && key !== 'month'
        );
        this.displayedColumns.pop();
        this.displayedColumns.push(...this.columnNames);
        this.displayedColumns.push('action');
      });
  }
  

  // Redirect on paylslip page
  downloadPaySlip(element) {

    this.router.navigate(['employee-payslip/'],
      {
        queryParams: {
          id: element?.employeeId,
          month: element?.month
        }
      }
    );
  }
  onMonthSelected(Month) {
    this.selectedMonth = Month
  }
  async onYearSelected(year) {
    this.selectedYear = year;
    this.getEmployeeSalary(); // Fetch data for the selected year
  }
  onAmountClick(i: number) {
    this.showIndex[i] = !this.showIndex[i];
  }
  onActualSalary(i: number) {
    this.actualSalaryIndex[i] = !this.actualSalaryIndex[i];
  }
  getMaskedSalary(salary: number): string {
    return '*'.repeat(salary.toString().length);
  }
}
