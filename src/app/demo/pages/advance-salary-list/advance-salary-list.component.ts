import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { userRole } from 'src/app/assets.model';
import { AdvanceSalaryFormComponent } from '../advance-salary-form/advance-salary-form.component';
import { RemarkPopUpComponent } from '../remark-pop-up/remark-pop-up.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

export enum AdvanceStatus {
  InProcess = 0,
  Approved = 1,
  Rejected = 2,
  Closed = 3
}
@Component({
  selector: 'app-advance-salary-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, AdvanceSalaryFormComponent],
  templateUrl: './advance-salary-list.component.html',
  styleUrls: ['./advance-salary-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdvanceSalaryListComponent {
  public personId = '';
  public searchDataValue = '';
  public employeeAdvanceId: string = '';

  isLoanAdd: boolean = false;

  public userRole: Array<userRole> = [];
  public tableData: Array<any> = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'code', 'amount',  'reason', 'remark', 'isActive', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
    if (requestId) {

    }
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isProfile(isProfile: boolean) {
    this.displayedColumns = isProfile ? ['code', 'amount', 'reason', 'remark', 'isActive', 'actions'] : ['name', 'code', 'amount', 'reason', 'remark', 'isActive', 'actions'];
    this._isProfile = isProfile;
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    if (this.personId && isProfile && !this.requestId) {
      this.getAdvanceByPersonId(this.personId);
    } else if (this.requestId) {
      this.getAdvanceByPersonId(this.requestId);
    }
    else {
      this.getAllAdvanceData();
    }
  }
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile: boolean;

  @Output() isAddLoanEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Loan";
      })
    }

    if (!this.isProfile && !this.personId) {
      this.getAllAdvanceData();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllAdvanceData() {
    this._commonService.get(`Advance/GetAllAdvance`).subscribe(res => {
      this.dataSource = new MatTableDataSource<any>(res);
      this.tableData = res;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  getAdvanceByPersonId(personId?: string) {
    // let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID ?? this.requestId 
    if (!personId) {
      personId = this.personId
    }
    this._commonService.get(`Advance/person/${personId}`).subscribe(res => {
        this.dataSource = new MatTableDataSource<any>(res);
      this.tableData = res;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }
  async approveRejectLoan(data, status: number) {
    const dialogRef = this.dialog.open(RemarkPopUpComponent, {
      width: '800px',
      data: { id: data.id, status: status, isAdvance : true, dataSource: this.dataSource.data?.find(x => x.id == data.id) },
    });


    dialogRef.afterClosed().subscribe(async (result) => {
      if (this.personId && this.isProfile) {
        this.getAdvanceByPersonId(this.personId);
      }
      else if (this._requestId) {
        this.getAdvanceByPersonId(this.requestId);
      }
      else {
        this.getAllAdvanceData();
      }
      dialogRef.close();
    });
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Advance/${element}`).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.getAdvanceByPersonId(this.personId ?? this.requestId);
        this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data;
    }
  }

  onAdvanceActionClick(event) {
    this.isLoanAdd = false;
    this.isAddLoanEvent.emit(false);
    if (event) {
      if (this.personId && this.isProfile) {
        this.getAdvanceByPersonId(this.personId);
      }
      else if (this._requestId) {
        this.getAdvanceByPersonId(this._requestId)
      }
      else {
        this.getAdvanceByPersonId()

      }
    }
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return (item?.personName).toLowerCase().includes(value.toLowerCase()) ||
          item?.personCode?.toString().toLowerCase().includes(value.toString().toLowerCase()) ||
          item?.reason?.toLowerCase().includes(value.toLowerCase()) ||
          item?.amount?.toString().includes(value.toString()) ||
          this.getStatusText(item?.status).toLowerCase().includes(value);
      });
    }
    return;
  }
  getStatusText(status: AdvanceStatus): string {
    switch (status) {
      case AdvanceStatus.InProcess:
        return 'In Process';
      case AdvanceStatus.Approved:
        return 'Approved';
      case AdvanceStatus.Rejected:
        return 'Rejected';
      case AdvanceStatus.Closed:
        return 'Closed';
      default:
        return '';
    }
  }
  addAdvance() {
    this.employeeAdvanceId = null;
    this.isLoanAdd = true;
    this.isAddLoanEvent.emit(true);
  }

  editAdvance(id: any) {
    this.employeeAdvanceId = id;
    this.isLoanAdd = true;
    this.isAddLoanEvent.emit(true);
  }
}
