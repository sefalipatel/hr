import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { ProfileInformationComponent } from '../profile-information/profile-information.component';
import { ProjectDetailComponent } from '../project-detail/project-detail.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { EmployeeFormComponent } from 'src/app/demo/pages/Employee/employee-form/employee-form.component';
import { AssethistorylistComponent } from 'src/app/demo/pages/assethistorylist/assethistorylist.component';
import { AssetcarrytohomeComponent } from 'src/app/demo/pages/assetcarrytohome/assetcarrytohome.component';
import { AssetUserAssignmentComponent } from 'src/app/asset-user-assignment/asset-user-assignment.component';
import FamilyDetailsComponent from 'src/app/demo/pages/Employee/family-details/family-details.component';
import AddressComponent from 'src/app/demo/pages/Employee/address/address.component';
import EducationComponent from 'src/app/demo/pages/Employee/education/education.component';
import ProfessionalTabComponent from 'src/app/demo/pages/Employee/professional-tab/professional-tab.component';
import { SalaryTabComponent } from 'src/app/demo/pages/Employee/salary-tab/salary-tab.component';
import { FinanceComponent } from 'src/app/demo/pages/finance/finance.component';
import { EmployeeInsuranceListComponent } from 'src/app/demo/pages/employee-insurance-list/employee-insurance-list.component';
import { LoanListComponent } from 'src/app/demo/pages/loan-list/loan-list.component';
import DocumentDetailsComponent from 'src/app/demo/pages/Employee/document-details/document-details.component';
import { EmployeePersonalInsuranceListComponent } from 'src/app/demo/pages/employee-personal-insurance-list/employee-personal-insurance-list.component';
import { BulkDocumentComponent } from 'src/app/demo/pages/Employee/bulk-document/bulk-document.component';
import { AdvanceSalaryListComponent } from 'src/app/demo/pages/advance-salary-list/advance-salary-list.component';
import { EmployeeBonusListComponent } from 'src/app/demo/pages/employee-bonus-list/employee-bonus-list.component';

@Component({
  selector: 'app-pro-detail',
  standalone: true,
  imports: [CommonModule, MatTabsModule, ProjectDetailComponent,
    EmployeeFormComponent,
    FamilyDetailsComponent,
    AddressComponent,
    EducationComponent,
    ProfessionalTabComponent,
    SalaryTabComponent,
    FinanceComponent,
    EmployeeInsuranceListComponent,
    EmployeePersonalInsuranceListComponent,
    LoanListComponent, AdvanceSalaryListComponent,
    EmployeeBonusListComponent,
    AssetUserAssignmentComponent,
    AssethistorylistComponent, AssetcarrytohomeComponent,
    DocumentDetailsComponent,
    SharedModule,
    BulkDocumentComponent, ProfileInformationComponent],
  templateUrl: './pro-detail.component.html',
  styleUrls: ['./pro-detail.component.scss']
})
export class ProDetailComponent implements OnInit {
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
  selectedMonth: number
 
  public userIdToEdit: string;
  public isCancelEditUser: boolean = false;
  isAssetAdd: boolean = false;
  isAssetCarryToHome: boolean = false;
  years: number[] = [];
  selectedYear: number;
  public selectTabIndex = 0;

  @Input() public set isProfile(profile: boolean) {
    
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }
0
  private _isProfile!: boolean;
  
  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;
  
  constructor(private router: Router, private _commonService: CommonService, private route: ActivatedRoute) {
    if (this.route.snapshot.queryParamMap.get('tab')) {
      this.setTabIndex(this.route.snapshot.queryParamMap.get('tab'))
    }
  }
  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
  
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];  
    });
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month
  }
  async onYearSelected(year) {
    this.selectedYear = year

  }
  onEditUser(event){
    this.userIdToEdit = event;
    this.isCancelEditUser = false;
  }

  onCancelEditUser(event){
    this.isCancelEditUser = event;
  }

  onAssetCarry(value) {
    this.isAssetAdd = value;
  }
  onAssetAction(value) {
    this.isAssetCarryToHome = value;
  }

  setTabIndex(tabName: string) {
    switch (tabName) {
      case 'asset':
        this.selectTabIndex = 6;
        break;

      default:
        break;
    }
  }
}
