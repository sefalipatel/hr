import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'primeng/api';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Loan, ToastType } from '../../models/models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { userRole } from 'src/app/assets.model';
import { LoanFormComponent } from '../loan-form/loan-form.component';
import { MatDialog } from '@angular/material/dialog';
import { RemarkPopUpComponent } from '../remark-pop-up/remark-pop-up.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';




export enum LoanStatus {
  InProcess = 0,
  Approved = 1,
  Rejected = 2,
  Closed = 3
}

export interface UserData {
  name: string;
  email: string;
  address: string;
  phone: string;
  notes: string;
  expanded?: boolean;
}










export interface LoanInstallment {
  id: string;
  employeeLoanId: string;
  monthlyAmount: number;
  instolmentDate: string;
  isPaid: boolean;
}
@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    FormsModule,
    LoanFormComponent,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoanListComponent implements OnInit, AfterViewInit {
  LoanStatus = LoanStatus;
  loading: boolean = false;
  public userRole: Array<userRole> = [];
  public loanRecords: Array<Loan>;
  public searchDataValue = '';
  public personId = '';
  public employeeLoanId: string = '';
  public tableData: Array<Loan> = [];

  expandedElement: any = null;
  installments: { [loanId: number]: any[] } = {};
  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['name', 'code', 'loanAmount', 'loanTenure', 'monthlyAmount', 'reason', 'isActive', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoanAdd: boolean = false;
  row: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.isProfileView = false;
    this.loanRecords = [];
  }

  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
    if (requestId) {
      this._commonService.get(`EmployeeLoan/person/${requestId}/true`).subscribe((res) => {
        this.loanRecords = res;
        this.dataSource = new MatTableDataSource<Loan>(this.loanRecords);
      });
    }
  }
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isProfile(isProfile: boolean) {
    this.displayedColumns = isProfile
      ? ['code', 'loanAmount', 'loanTenure', 'monthlyAmount', 'reason', 'remark', 'isActive', 'actions']
      : ['name', 'code', 'loanAmount', 'loanTenure', 'monthlyAmount', 'reason', 'remark', 'isActive', 'actions'];
    this._isProfile = isProfile;
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;

    if (this.personId && isProfile) {
      this.getAllLoanDataById(this.personId, true);
    } 
    else {
      this.getAllLoanData();
    }
  }
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile: boolean;

  @Input() public set isProfileView(isProfile: boolean) {
    this.displayedColumns = isProfile
      ? ['code', 'loanAmount', 'loanTenure', 'monthlyAmount', 'reason', 'remark', 'isActive', 'actions']
      : ['name', 'code', 'loanAmount', 'loanTenure', 'monthlyAmount', 'reason', 'remark', 'isActive', 'actions'];
    this._isProfileView = isProfile;
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID; 
    if (!this.requestId && !isProfile) this.getAllLoanData();
  }
  public get isProfileView(): boolean {
    return this._isProfileView;
  }
  private _isProfileView: boolean;

  @Input() public set isBankTab(isBankTab: boolean) {
    this._isBankTab = isBankTab;
  }

  public get isBankTab(): boolean {
    return this._isBankTab;
  }

  private _isBankTab!: boolean;

  @Output() isAddLoanEvent: EventEmitter<boolean> = new EventEmitter();

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'Loan';
      });
    }
  } 

  toggleAccordion(loan: any): void {
    this.expandedElement = this.expandedElement === loan ? null : loan;

    this._commonService.get(`EmployeeLoan/GetInstolmentDate?loanId=${loan.id}`).subscribe(
      (res) => {
        this.installments[loan.id] = res;
      },
      (err) => {
        this.installments[loan.id] = [];
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllLoanData() {
    this.loading = true;
    this._commonService.get(`EmployeeLoan`).subscribe((res: Loan[]) => {
      this.loading = false;
      this.loanRecords = res;
      this.dataSource = new MatTableDataSource<Loan>(this.loanRecords);
      this.tableData = res;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    });
  }

  getAllLoanDataById(id: string, isProfile?: boolean) {
    this._commonService.get(`EmployeeLoan/person/${id}/true`).subscribe((res) => {
      this.loanRecords = res;
      this.dataSource = new MatTableDataSource<Loan>(this.loanRecords);
    });
  }

  activeStatusChange(status: Event, id: any) {
    this.loading = true;
    this._commonService.post(`EmployeeLoan`, '').subscribe(
      (res) => {
        this.loading = false;
        this.getAllLoanData();
      },
      (error) => { }
    );
  }

  addLoan() {
    this.employeeLoanId = null;
    this.isLoanAdd = true;
    this.isAddLoanEvent.emit(true);
  }

  editLoan(id: any) {
    this.employeeLoanId = id;
    this.isLoanAdd = true;
    this.isAddLoanEvent.emit(true);
  }

  isButtonDisabled(row): boolean {
    return row.loanStatus === LoanStatus.Approved || (row.loanStatus === LoanStatus.Rejected) === true;
  }

  buttonDisabledState: { [key: number]: boolean } = {};
  approveRejectStatus(row, status: number) {
    this._commonService.put(`EmployeeLoan/${row?.id}/status/${status}`, null).subscribe((res: any) => {
      this.buttonDisabledState[row.id] = true;
      if (res.value === true) {
        this.getAllLoanData();
      }
    });
  }

  async approveRejectLoan(data, status: number) {
    const dialogRef = this.dialog.open(RemarkPopUpComponent, {
      width: '800px',
      data: { id: data.id, status: status, dataSource: this.dataSource.data?.find((x) => x.id == data.id) }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (this.personId && this.isProfile) {
        this.getAllLoanDataById(this.personId);
      } else if (this._requestId) {
        this.getAllLoanDataById(this.requestId);
      } else {
        this.getAllLoanData();
      }
      dialogRef.close();
    });
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`EmployeeLoan/${element}`).subscribe(
        (res) => {
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
          if (this.personId && this.isProfile) {
            this.getAllLoanDataById(this.personId);
          } else if (this._requestId) {
            this.getAllLoanDataById(this.requestId);
          }
          this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
      this.dataSource.data;
    }
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        return (
          item.monthlyAmount?.toString().includes(value.toString()) ||
          (item?.firstName + ' ' + item?.lastName).toLowerCase().includes(value.toLowerCase()) ||
          item?.loanAmount?.toString().includes(value.toString()) ||
          item?.loanStatus?.toString().includes(value.toString()) ||
          item?.reason?.toString().includes(value.toString()) ||
          item?.loanTenure?.toString().includes(value.toString())
        );
      });
    }
    return;
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

  exportJson(): void {
    const filteredData = this.dataSource.data.map((row) => {
      const filteredRow = {};
      this.displayedColumns?.forEach((column) => {
        filteredRow['name'] = row?.person?.firstName + ' ' + row?.person?.lastName;
        filteredRow['code'] = row?.person?.personCode;
        filteredRow['loanAmount'] = row?.loanAmount;
        filteredRow['loanTenure'] = row?.loanTenure;
        filteredRow['monthlyAmount'] = row?.monthlyAmount;
        filteredRow['reason'] = row?.reason;
        filteredRow['remark'] = row?.remark;
        filteredRow['isActive'] = this.getStatusText(row?.loanStatus);
      });
      return filteredRow;
    });
    this._commonService.exportAsExcelFile(filteredData, 'LoanList', this.displayedColumns);
  }
  onLoanActionClick(event) {
    this.isLoanAdd = false;
    this.isAddLoanEvent.emit(false);

    if (event) {
      if (this.personId && this.isProfile) {
        this.getAllLoanDataById(this.personId);
      } else if (this._requestId) {
        this.getAllLoanDataById(this.requestId);
      } else {
        this.getAllLoanData();
      }
    }
  }

  getStatusText(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.InProcess:
        return 'In Process';
      case LoanStatus.Approved:
        return 'Approved';
      case LoanStatus.Rejected:
        return 'Rejected';
      case LoanStatus.Closed:
        return 'Closed';
      default:
        return '';
    }
  }

}
