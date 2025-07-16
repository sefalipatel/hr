import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { userRole } from 'src/app/assets.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';
import { EmployeePersonalInsuranceFormComponent } from '../employee-personal-insurance-form/employee-personal-insurance-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
enum InsuranceType {
  MedicalInsurance = 0,
  LifeInsurance = 1
}

const InsuranceTypeLabels = {
  [InsuranceType.MedicalInsurance]: 'Medical Insurance',
  [InsuranceType.LifeInsurance]: 'Life Insurance',
};
enum employeeInsuranceEnum {
  employeeName = "employeeName",
  companyName = "companyName",
  planName = "planName",
  coverAmount = "coverAmount",
  insuranceType = "insuranceType",
  action = "action"
}

@Component({
  selector: 'app-employee-personal-insurance-list',
  standalone: true,
  imports: [CommonModule, SharedModule,MatProgressSpinnerModule, MaterialModule, EmployeePersonalInsuranceFormComponent],
  templateUrl: './employee-personal-insurance-list.component.html',
  styleUrls: ['./employee-personal-insurance-list.component.scss']
})
export class EmployeePersonalInsuranceListComponent implements OnInit {

  public employeeInsuranceList: any[] = [];
  public userRole: Array<userRole> = [];
  
  public searchDataValue = '';
  public personId = '';
  loading : boolean = false
  public employeeInsuranceId = '';
  isInsuranceAdd: boolean = false;
  dateFormat:string = localStorage.getItem('Date_Format');
  
  displayedColumns: any[]=[];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() public set isProfile(isProfile: boolean) {
    this.displayedColumns = isProfile ? Object.values(employeeInsuranceEnum).filter(column => column != 'employeeName') : Object.values(employeeInsuranceEnum).filter(column =>column != 'action');;
    if (isProfile) {
      this.getInsuranceByPersonId();
    }
    else {
      this.getEmployeeInsuranceList()
    } 
  }
    
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile: boolean;

  @Input() public set requestId(requestId: string) {  
    this._requestId = requestId;
    this.displayedColumns = requestId ? Object.values(employeeInsuranceEnum).filter(column => column != 'employeeName') : Object.values(employeeInsuranceEnum).filter(column =>column != 'action');
    if (requestId) {
      this.getInsuranceByPersonId();
    }
    else {
        this.getEmployeeInsuranceList()
      }
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;
  
  @Output() isAddInsuranceEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private _commonService: CommonService, private route: ActivatedRoute, private router: Router, private sweetlalert: SweetalertService) {
    this.isProfile = false;
    this.displayedColumns = Object.values(employeeInsuranceEnum).filter(column =>column != 'action');
  }
  
  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Insurance";
      })
    }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.personId = userInfo?.personID || '';  // Ensure personId is set
  
    if (this.isProfile || this.requestId) {
      this.getInsuranceByPersonId();
    } else {
      this.getEmployeeInsuranceList();
    }
  }

  getInsuranceByPersonId() {
    this._commonService.get(`EmployeePersonalInsurance/GetAllPersonalInsuranceByPersonId?PersonId=${this.requestId}`).subscribe(res => {
      this.employeeInsuranceList = res;
      this.dataSource = new MatTableDataSource<any>(this.employeeInsuranceList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  getEmployeeInsuranceList() {
    this.loading = true
    this._commonService.get('EmployeePersonalInsurance').subscribe(res => {
      this.loading = false
      this.employeeInsuranceList = res;
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`EmployeePersonalInsurance/${element.id}`).subscribe(res => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.getInsuranceByPersonId();
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  
  addEmployeeInsurance() {
    this.isInsuranceAdd = true;
    this.isAddInsuranceEvent.emit(true);
  }
  onActionClick(event) {
    this.isInsuranceAdd = false;
    this.isAddInsuranceEvent.emit(false);
    if (event) {
      if (this.isProfile || this._requestId) {
        this.getInsuranceByPersonId()
      }
      else {
        this.getEmployeeInsuranceList()
      }
    }
  }
  getStatusLabel(status: number): string {
    return InsuranceTypeLabels[status] || 'Unknown';
  }

  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.employeeInsuranceList;
    } else {
      this.dataSource.data = this.employeeInsuranceList.filter((item) => {
        return item?.companyName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.planName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.employeeName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.coverAmount?.toString().includes(value.toString()) ||
          this.getStatusLabel(item?.insuranceType)?.toLowerCase().includes(value.toLowerCase());
      })
    }
  }
}
