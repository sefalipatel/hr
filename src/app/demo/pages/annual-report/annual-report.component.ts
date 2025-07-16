import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from 'primeng/api';
import { CommonService } from 'src/app/service/common/common.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


export enum annualSalaryEnum {
  personCode = "personCode",
  employeeName = "employeeName",
  annualCTC = "annualCTC"
}
@Component({
  selector: 'app-annual-report',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatProgressSpinnerModule, MatSortModule, MatPaginatorModule, SharedModule, MatSelectModule, FormsModule],
  templateUrl: './annual-report.component.html',
  styleUrls: ['./annual-report.component.scss']
})
export class AnnualReportComponent implements OnInit {
  public dataSource = new MatTableDataSource<any>();
  public displayedColumns: string[] = [];
  public annualReportListes: any;
  public selectedYear: number;
  public years: number[] = [];
  public columnNames: string[] = [];
  public defaultYear: any;
  loading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private commonService: CommonService) {
    this.displayedColumns = [];
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear();
    this.getAnnualReport();
    this.defaultYear = currentDate.getFullYear();
  }

  getAnnualReport() {
    this.loading = true
    this.commonService.get(`Payroll/GetAllEmployeeMonthlySalaryForYear/${this.selectedYear}`).subscribe(res => {
      this.loading = false
      this.annualReportListes = res;
      this.dataSource = new MatTableDataSource<any>(this.annualReportListes);
      this.columnNames = Object.keys(this.annualReportListes[0]).filter(key => key !== 'personCode' && key !== 'employeeName' && key !== 'annualCTC' && key !== 'personId');
      this.displayedColumns = [];
      const enumFields = Object.values(annualSalaryEnum);
      enumFields.forEach(field => {
        if (!this.displayedColumns.includes(field)) {
          this.displayedColumns.push(field);
        }
      });
      this.displayedColumns.push(...this.columnNames);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  transFormHeader(column) {
    return column
      .replace(/([A-Z])/g, ' $1') // insert a space before all caps
      .replace(/^./, function (str) { return str.toUpperCase(); }); // capitalize the first character
  }

  onYearSelected(year) {
    this.selectedYear = year;
  }

  applyBtn() {
    if (this.selectedYear) {
      this.getAnnualReport();
    }
  }

  reset() {
    this.selectedYear = this.defaultYear;
    this.getAnnualReport();
  }

}
