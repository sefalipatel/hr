import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';

enum ExpenseEnum {
  typeName = "typeName",
  action = "action"
}
@Component({
  selector: 'app-expense-type-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './expense-type-list.component.html',
  styleUrls: ['./expense-type-list.component.scss']
})
export class ExpenseTypeListComponent implements OnInit {
  public expenseId: string
  public searchDataValue = '';
  public userRole: Array<userRole> = [];
  public expenseTypeList: Array<any>;
  public type: string
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  validationMessage: string = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = false;

  constructor(private _commonService: CommonService, private route: ActivatedRoute, private router: Router, private sweetlalert: SweetalertService) {
    this.displayedColumns = Object.values(ExpenseEnum);
  }
  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "ExpenseType";
      })
    }
    this.getExpensTypeData();
  }

  getExpensTypeData() {
    this.loading = true
    this._commonService.get('ExpenseType').subscribe(res => {
      this.loading = false
      this.expenseTypeList = res;
      this.dataSource = new MatTableDataSource<any>(this.expenseTypeList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`ExpenseType/${element.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Expense type deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getExpensTypeData();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  addExpense() {
    this.router.navigate(['expense-type-form']);
  }

  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.expenseTypeList;
    } else {
      this.dataSource.data = this.expenseTypeList.filter((item) => {
        return item?.typeName.toLowerCase().includes(value.toLowerCase());
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
  getFormValue(id: string) {
    if (id) {
      this.expenseId = id
      this._commonService.get(`ExpenseType/${id}`).subscribe(res => {
        this.type = (res?.value.typeName);
      })
    }
  }
  addExpenseType() {
    this.type = this.type?.trim();
    if (!this.type) {
      this.validationMessage = 'Expense type is required';
      return;
    }

    this.validationMessage = '';

    if (this.expenseId) {
      const payload = { id: this.expenseId, typeName: this.type };
      this._commonService.put('ExpenseType', payload).subscribe(res => {
        if (res?.statusCode == 200) {
          this.getExpensTypeData();
          this._commonService.showToast('Expense type updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (res?.errors[0]?.errorMessage === "already exist") {
          this._commonService.showToast("Expense type already exists", ToastType.ERROR, ToastType.ERROR);
        }
      }, () => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR);
      });
    } else {
      this._commonService.post('ExpenseType', { typeName: this.type }).subscribe(res => {
        if (res?.statusCode == 200) {
          this.getExpensTypeData();
          this._commonService.showToast('Expense type added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (res?.errors[0]?.errorMessage === "already exist") {
          this._commonService.showToast("Expense type already exists", ToastType.ERROR, ToastType.ERROR);
        }
      }, () => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR);
      });
    }

    this.type = '';
  }

  trimNameOnBlur() {
    this.type = this.type?.trim();
    if (!this.type) {
      this.validationMessage = 'Expense type is required';
    } else {
      this.validationMessage = '';
    }
  }
  @Output() onAction: EventEmitter<boolean> = new EventEmitter();
  onList() {
    this.onAction.emit(false);
  }
}
