import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { userRole } from 'src/app/assets.model';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastType } from 'src/app/service/common/common.model';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';

export interface invoicedata {
  id: string;
  invoiceDate: string;
  description: string;
  amount: string; 
  status: boolean;
}
@Component({
  selector: 'app-invoicelist',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatMenuModule],
  templateUrl: './invoicelist.component.html',
  styleUrls: ['./invoicelist.component.scss']
})
export class InvoicelistComponent {
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
  loading: boolean = false;
  selectedMonth: number;
  selectedYear: number;
  years: number[] = [];
  totalnumberPresant: any
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public tableData: Array<invoicedata> = [];
  displayedColumns: string[] = ['invoiceDate', 'amount', 'description', 'status', 'actions'];
  dataSource = new MatTableDataSource<invoicedata>();
  public userRole: Array<userRole> = [];
  constructor(
    private router: Router,
    private apiService: ApiService,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService
  ) { }
  async ngOnInit() {

    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    } 

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'Invoice';
      });
    }
    this.getInvoice();
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
        }
      });
      return filteredRow;
    });
    this.api.exportAsExcelFile(filteredData, 'InvoiceList', this.displayedColumns);
  }

  statusvalue(value) {
    const priority = ['true', 'false'];
    let list = priority.filter((item, index) => index == value);
    return list;
  }
  editItem(id: string) {
    this.router.navigate(['/add-invoice/' + id]); 
  }
  onBtnClick() {
    this.router.navigate(['/add-invoice']);
  }
  async deleteinvoice(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Invoice/${element.id}`).subscribe((res) => {
        if (res.statusCode) {
          this.apiService.showToast('Invoice deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        } else if (res.statusCode != 200) {
          this.apiService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR);
        }
      });
      this.dataSource.data;
    }
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month;
    this.getInvoice();
  }
  async onYearSelected(year) {
    this.selectedYear = year;
    this.getInvoice();
  }
  getInvoice() {
    this.loading = true
    this.api.get(`invoice/invoice?year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((response) => {
    this.loading = false 
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.tableData = response;
      this.totalnumberPresant = response.table1[0].total_PresentDay
      response.table.map((x) => { 
      }); 
    })

  }
  resetButton() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getInvoice();
  }
  getallInvocieDetails() {
    this.apiService.getInvocieDetails();
  }
  activeStatusChange(status: MatSlideToggleChange, data: any) {
    this.loading = true;
    this._commonService.put(`invoice/changeStatus?id=${data}&status=${status.checked == false ? 0 : 1}`, '').subscribe(
      (res) => {
        this.loading = false;

        this.getInvoice();
        if (!res) {
          this.getInvoice();
        }
      },
      (error) => { }
    );
  }
}
