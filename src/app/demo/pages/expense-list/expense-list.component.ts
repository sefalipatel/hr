import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userRole } from 'src/app/assets.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ExpenseTypeListComponent } from '../expense-type-list/expense-type-list.component';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

enum ExpenseEnum {
  typeName = "typeName",
  expensePersonName = "expensePersonName",
  paidPersonName = "paidPersonName",
  expenseDate = "expenseDate",
  amount = "amount",
  description = "description",
  status = "status",
  action = "action"
}

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, SharedModule, ExpenseTypeListComponent, MatIconModule, MatMenuModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {
  isForm?: boolean = false;
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
  public searchDataValue = '';
  attachmentUrl: string = environment.apiUrl.replace('api/', '')
  public userRole: Array<userRole> = [];
  public expenseList: Array<any>;
  private requestId!: string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  selectedMonth: number;
  selectedYear: number;
  years: number[] = [];
  totalnumberPresant: any;
  showEmoji = true;
  loading: boolean = false;
  dateFormat:string = localStorage.getItem('Date_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _commonService: CommonService, private route: ActivatedRoute,
    private router: Router, private sweetlalert: SweetalertService,
    private api: CommonService) {
    this.displayedColumns = Object.values(ExpenseEnum);
  }

  ngOnInit(): void {
    this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID;

    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Expense";
      })
    }
    this.getExpense();
  }

  editExpense(element) {
    this.router.navigate([`expense-claim/${element.id}`]);
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Expense/${element.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Expense deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getExpense();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  addExpense() {
    this.router.navigate(['expense-claim']);
  }

  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.expenseList;
    } else {
      this.dataSource.data = this.expenseList.filter((item) => {
        return item?.expenseName.toLowerCase().includes(value.toLowerCase()) ||
          item?.expensePersonName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.paidPersonName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.amount?.toString().includes(value.toString()) ||
          item?.description?.toString().includes(value.toString())
      })
    }
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
  onMonthSelected(Month) {
    this.selectedMonth = Month;
    this.getExpense();
  }
  async onYearSelected(year) {
    this.selectedYear = year;
    this.getExpense();
  }
  resetButton() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getExpense();
  }
  getExpense() {
    this.loading = true
    if (this.userRole[0]?.canEdit) {
      this._commonService.get(`Expense/allexpense?year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe(res => {
        this.loading = false
      this.expenseList = res;
      this.dataSource = new MatTableDataSource<any>(this.expenseList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    }, (err)=> {
      this.loading = false
    })
    }
    else if(JSON.parse(localStorage.getItem('userInfo'))?.personID){
      this.getExpenseById();
    }

  }

  getExpenseById() {
    let personId = '';
    if (this.userRole[0]?.canEdit) { 
      personId = '';
    }
    else {
      personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    }
    this.loading = true

    this.api.get(`Expense/expense?userId=${personId}&year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((response) => {
    this.displayedColumns = Object.values(ExpenseEnum).filter(column => column != 'expensePersonName' && column != 'paidPersonName' && column != 'action');
    this.loading = false

        this.expenseList = response;
        this.dataSource = new MatTableDataSource(this.expenseList);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 300);
      });
  }
  activeStatusChange(status: MatSlideToggleChange, data: any) {
    this.loading = true;
    this._commonService.put(`Expense/changeStatus`, {
      id: data,
      paidBy: this.requestId,
      Status: status.checked == false ? 0 : 1
    }).subscribe(
      (res) => {
        this.loading = false;
        this.getExpense();
        if (!res) {
          this.getExpense();
        }
      },
      (error) => { }
    );
  }
  ExpenseType() {
    this.isForm = true
  }
  CancelExpanse() {
    this.isForm = false
  }
  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
          filteredRow['status'] = row?.status ? 'Paid' : 'Unpaid';
        }
      });
      return filteredRow;
    });
    this.api.exportAsExcelFile(filteredData, 'ExpenseList', this.displayedColumns);
  }
  downloadFile(text) {
    saveAs(this.attachmentUrl + text.bill.replace('wwwroot\\', ''), text.bill.replace('wwwroot\\', '') );
  };
}
