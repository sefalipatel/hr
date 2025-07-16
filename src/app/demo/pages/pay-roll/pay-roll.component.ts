import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonService } from 'src/app/service/common/common.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Payroll, ToastType } from '../../models/models';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/theme/shared/shared.module';

export enum payRollEnum {
  employeeCode = "employeeCode",
  employeeName = "employeeName",
  ctc = "ctc",
  monthlyCTC = "monthlyCTC",
  action = "action"
}
@Component({
  selector: 'app-pay-roll',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule,MatProgressSpinnerModule, MatSortModule, MatPaginatorModule],
  templateUrl: './pay-roll.component.html',
  styleUrls: ['./pay-roll.component.scss']
})
export class PayRollComponent implements OnInit {
  public displayedColumns: string[] = [];
  public getEmployeePayRoll: Array<Payroll>;
  public columnNames: string[] = [];
  public searchDataValue = '';
  loading: boolean = false
  dataSource = new MatTableDataSource<Payroll>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private _commonService: CommonService,
    private sweetlalert: SweetalertService) {
    this.displayedColumns = [];
  }

  ngOnInit(): void {
    this.getPayRoll();
  }

  // first letter capital and space between word
  transformColumnName(name: string): string {
    // Convert camelCase to space-separated words
    return name
      .replace(/([A-Z])/g, ' $1') // insert a space before all caps
      .replace(/^./, function (str) { return str.toUpperCase(); }); // capitalize the first character
  }

  addPayroll() {
    this.router.navigate(['employee-payroll-assign'])
  }

  getPayRoll() {
    this.loading = true
    this._commonService.get('Payroll').subscribe((res:any) => {
      this.loading = false
      this.getEmployeePayRoll = res || [];
      this.dataSource = new MatTableDataSource<Payroll>(this.getEmployeePayRoll);
      this.displayedColumns = [];
      this.columnNames = Object.keys(this.getEmployeePayRoll[0]).filter(key => key !== 'employeeName' && key !== 'annualCTC' && key !== 'employeeId' && key !== 'employeeCode' && key !== 'payrollId' && key !== 'monthlyCTC');
      this.displayedColumns.push(...Object.values(payRollEnum));
      this.displayedColumns.pop();
      this.displayedColumns.push(...this.columnNames);
      this.displayedColumns.push('action');

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  // search functionality by name, plantype and company name
  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.getEmployeePayRoll;
    } else {
      this.dataSource.data = this.getEmployeePayRoll.filter((item) => {
        return item?.employeeName.toLowerCase().includes(value.toLowerCase()) ||
          item?.employeeCode.toLowerCase().includes(value.toLowerCase())
      })
    }
  }

  // Delete payroll
  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`payroll/${id}`).subscribe(res => {
        if (res == true) {
          this._commonService.showToast('Payroll deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getPayRoll();
        } else {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
}
