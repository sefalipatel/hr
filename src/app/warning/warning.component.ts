import { Component, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ToastType } from '../demo/models/models';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
export interface broadcastlist {
  comment: string;
  companyPolicy: string;
  employee: string;
  person: string;
  companyPolicyId: string;
  createdBy: string;
  createdAt: string;
  id: string;
  employeeCode:string

}
@Component({
  selector: 'app-warning',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule,MatTooltipModule, MatSelectModule, MatSortModule, MatProgressSpinnerModule, MatTableModule, MatSlideToggleModule
    , FormsModule],
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent {
  totalwarning: any;
  constructor(private router: Router,
    private apiService: ApiService,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService, private datePipe: DatePipe) {

  }
  public tableData: Array<broadcastlist> = [];
  public userRole: Array<userRole> = [];
  type: string = '';
  public selectedYear: any;
  public selectedMonth: any;
  defaultYear: any;
  defaultMonth: any;
  dataSource = new MatTableDataSource<broadcastlist>();
  public sortConfig!: Sort
  dateFormat: string = localStorage.getItem('Date_Format');
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public years: number[] = [];
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
  displayedColumns: string[] = ['comment', 'companyPolicyName', 'employeeName','employeeCode', 'department', 'createdByName', 'createdAt',];
  loading: boolean = false
  async ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();

    this.defaultYear = currentDate.getFullYear();
    this.defaultMonth = currentDate.getMonth() - 0;

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "CompanyPolicy";
      })
    }
    this.getAllwarning();
  }

  addbroadcast() {
    this.router.navigate(['warning/warning-form'])
  }

  async onYearSelected(year) {
    this.selectedYear = year ?? '';
  }

  onMonthSelected(month) {
    this.selectedMonth = month ?? '';
  }

  getAllwarning() {
    this.loading = true
    this.totalwarning = 0
    this._commonService.get(`Warning?month=${this.selectedMonth}&year=${this.selectedYear}`).subscribe((res) => {
      this.loading = false
      setTimeout(() => {
      }, 300);
      this.dataSource.data = res
      this.totalwarning = res.length
      res?.map(x => {
        if (x?.createdAt) {
          x.createdAt = this.datePipe.transform(new Date(x.createdAt), 'yyyy-MM-ddTHH:mm:ss');
        }
        return x;
      })

    })
  }
  

  Reset() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getAllwarning()
  }

  async deleteBtn(row) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Warning/${row.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Warning deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllwarning();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}


