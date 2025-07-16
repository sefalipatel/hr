import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import ProfessionalTabComponent from '../professional-tab/professional-tab.component';
import { CommonService } from 'src/app/service/common/common.service';
import AddressComponent from '../address/address.component';
import { Department, Designation, RoleId, ToastType } from 'src/app/service/common/common.model';
import FamilyDetailsComponent from '../family-details/family-details.component';
import BankDetailsComponent from '../bank-details/bank-details.component';
import DocumentDetailsComponent from '../document-details/document-details.component';
import { PfDetailsComponent } from '../../pf-details/pf-details.component';
import { DatePipe } from '@angular/common';
import { FinanceComponent } from '../../finance/finance.component';
import { AssetUserAssignmentComponent } from 'src/app/asset-user-assignment/asset-user-assignment.component';
import { AssignuserComponent } from 'src/app/project-management/assignuser/assignuser.component';
import { AssethistorylistComponent } from '../../assethistorylist/assethistorylist.component';
import { SalaryTabComponent } from '../salary-tab/salary-tab.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import EducationComponent from '../education/education.component';
import { LoanListComponent } from '../../loan-list/loan-list.component';
import { EmployeeInsuranceListComponent } from '../../employee-insurance-list/employee-insurance-list.component';
import { AssetcarrytohomeComponent } from '../../assetcarrytohome/assetcarrytohome.component';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, FormsModule, SharedModule, MatTabsModule,EmployeeFormComponent, ProfessionalTabComponent,EducationComponent, AddressComponent, FamilyDetailsComponent, BankDetailsComponent, PfDetailsComponent, DocumentDetailsComponent, FinanceComponent,EmployeeInsuranceListComponent,LoanListComponent, AssetUserAssignmentComponent, AssignuserComponent, AssethistorylistComponent,AssetcarrytohomeComponent, SalaryTabComponent],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export default class AddEmployeeComponent implements OnInit {

  requestId: string;
  RoleId: Array<RoleId> = [];
  isView?: boolean;
  show = false;
  password = 'password';
  public isSubmitted: boolean;
  public isProffesionalTab: boolean;
  public isEducationTab: boolean;
  public isLoanTab: boolean;
  public isBankTab: boolean;
  isAssetAdd: boolean = false;
  isAssetCarryToHome: boolean = false;

  requestEmpId: string;

  selectTabIndex = 0;
  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;

  constructor(private formBuilder: FormBuilder, private router: Router, private api: CommonService, private route: ActivatedRoute, private datePipe: DatePipe) {
    if (this.route.snapshot.queryParamMap.get('tab')) {
      this.setTabIndex(this.route.snapshot.queryParamMap.get('tab'))
    }
  }
  ngOnInit() {

    const orgID = localStorage.getItem('orgId')
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });

    this.api.get(`Roles/RoleByOrgId/${orgID}`).subscribe((response) => {
      this.RoleId = response.value
    })
  }

  onProffesionalTabClick(event){
    this.isProffesionalTab = event
  }
  onEducationTabClick(event){
    this.isEducationTab = event
  }
  onAddLoanTabClick(event){
    this.isLoanTab = event
  }
  onAddBankTabClick(event){
    this.isBankTab = event
  }
  receiveEmployeeId($event: any) {
    this.requestEmpId = $event;
  }
  onAssetCarry(value) {
    this.isAssetAdd = value;
  }
  onAssetAction(value) {
    this.isAssetCarryToHome = value;
  }
  Cancel() {
    this.router.navigate(['/employee-details'])
  }

  onNewClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
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



