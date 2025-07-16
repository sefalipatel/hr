import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonService } from 'src/app/service/common/common.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { employeeInsuranceList, userRole } from 'src/app/assets.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from "../../../loader/loader.component";

enum employeeInsuranceEnum {
  employeeName = "employeeName",
  companyName = "companyName",
  amount = "amount",
  NextRenewalDate = "NextRenewalDate",
  action = "action"
}
@Component({
  selector: 'app-employee-insurance-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatSortModule, MatPaginatorModule, FormsModule, MatMenuModule, MatIconModule, MatTooltipModule, LoaderComponent],
  templateUrl: './employee-insurance-list.component.html',
  styleUrls: ['./employee-insurance-list.component.scss']
})
export class EmployeeInsuranceListComponent implements OnInit {
  public employeeInsuranceList: Array<employeeInsuranceList>;
  public userRole: Array<userRole> = [];
  public searchDataValue = '';
  public personId = '';
  public employeeInsuranceId = '';
  dateFormat:string = localStorage.getItem('Date_Format');
  loading: boolean = false

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
    this.displayedColumns = requestId ? Object.values(employeeInsuranceEnum).filter(column => column != 'employeeName' && column != 'action') : Object.values(employeeInsuranceEnum);
    if (requestId) {
      this._commonService.get(`EmployeeInsurance/person/${this.requestId}/${!this.isProfile}`).subscribe(res => {
        this.employeeInsuranceList = res
        this.dataSource = new MatTableDataSource<employeeInsuranceList>(this.employeeInsuranceList);
      })
    }
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isLoanTab(isLoanTab: boolean) {
    this._isLoanTab = isLoanTab;
  };
  public get isLoanTab(): boolean {
    return this._isLoanTab;
  }
  private _isLoanTab!: boolean;

  @Input() public set isProfile(isProfile: boolean) {
    this.displayedColumns = isProfile && this._requestId ? Object.values(employeeInsuranceEnum).filter(column => column != 'employeeName' && column != 'action') : Object.values(employeeInsuranceEnum);
    this._isProfile = isProfile;
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    if (this.personId && isProfile) {
      this._commonService.get(`EmployeeInsurance/person/${this.personId}/${isProfile}`).subscribe(res => {
        this.employeeInsuranceList = res
        this.dataSource = new MatTableDataSource<employeeInsuranceList>(this.employeeInsuranceList);
      })
    } 
    else {
      this.getEmployeeInsuranceList()
    }
  }
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile: boolean;

  @Output() employeeId = new EventEmitter<string>();
  displayedColumns: string[] = [];

  constructor(private _commonService: CommonService, private route: ActivatedRoute, private router: Router, private sweetlalert: SweetalertService) {
    this.isProfile = false;
    this.displayedColumns = Object.values(employeeInsuranceEnum);
  }


  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Insurance";
      })
    }
  }

  // get all list function
  getEmployeeInsuranceList() {
    this.loading = true
    this._commonService.get('EmployeeInsurance').subscribe(res => {
      this.loading = false
      this.employeeInsuranceList = res;
      this.dataSource = new MatTableDataSource<employeeInsuranceList>(this.employeeInsuranceList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow['employeeName'] = row?.firstName;
          filteredRow['companyName'] = row?.companyName + ' ( ' + (row?.planType) + ' )';
          filteredRow[column] = row[column];
          filteredRow['NextRenewalDate'] = row?.nextRenewalDate;
        }
      });
      return filteredRow;
    });
    this._commonService.exportAsExcelFile(filteredData, 'EmployeeInsuranceList', this.displayedColumns);
  }
  // Go to employee insurance form on click edit icon
  editEmployeeInsurance(element) {
    this.employeeInsuranceId = element.id
    this.router.navigate([`add-employee-insurance/${element.id}`]);
    this.employeeId.emit(element.id);
  }

  // delete function
  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`EmployeeInsurance/${element.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Employee insurance deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getEmployeeInsuranceList();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  //  Go to employee insurance form on click of Add insurance button
  addEmployeeInsurance() {
    this.router.navigate(['add-employee-insurance']);
  }

  // search functionality by name, plantype and company name
  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.employeeInsuranceList;
    } else {
      this.dataSource.data = this.employeeInsuranceList.filter((item) => {
        return (item?.firstName + ' ' + item?.lastName).toLowerCase().includes(value.toLowerCase()) ||
          item?.companyName.toLowerCase().includes(value.toLowerCase()) ||
          item?.planType.toLowerCase().includes(value.toLowerCase()) ||
          item?.amount?.toString().includes(value.toString()) ||
          item?.nextRenewalDate?.toString().includes(value.toString())
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

}
