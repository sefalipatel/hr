import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { MatStepperIntl } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SubscriptionPlanFormComponent } from './subscription-plan-form/subscription-plan-form.component';

@Component({
  selector: 'app-org-subscription',
  
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MaterialModule, SharedModule, RouterModule, SubscriptionPlanFormComponent, ],
  templateUrl: './org-subscription.component.html',
  styleUrls: ['./org-subscription.component.scss']
})
export class OrgSubscriptionComponent implements OnInit{

  public expiryDate;
  public subId: string = '';
  public currentPlan: string = '';
  public packagePrice: any;
  dateFormat:string = localStorage.getItem('Date_Format');

  public moduleList: any[] = [];
  public packageList: any[] = [];
  public packageRecords: any[] = [];

  constructor(public dialog: MatDialog,private _matStepperIntl: MatStepperIntl,private router: Router, private _commonService: CommonService, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.packageRecords = JSON.parse(JSON.stringify(this.packageList));
  }
  ngOnInit(): void {
    this.getAllModules();
    this.getPackageData();
    this.getRecordById();
    this.getAllDuration();
  }

  getRecordById() {
    this.route.params.subscribe(async (params) => {
      this.subId = params['id'];
    });
    this._commonService.get(`Organizations/GetOrgPackageById?id=${this.subId}`).subscribe(res => {
      this.currentPlan = res?.value?.currentPackage;
      this.expiryDate = res?.value?.packageExpiryDate;
      this.packagePrice = res?.value?.packages[0]?.price;
    })
  }
  getAllModules() {
    this._commonService.get(`Modules`).subscribe(res => {
      this.moduleList = res;
    })
  }

  getPackageData() {
    this._commonService.get(`Package`).subscribe(res => {
      this.packageList = res;
      this.packageRecords = res;
    })
  }

  isModulePresent(moduleId: string, packageModules: any[]): boolean {
    return packageModules.some(module => module.moduleId === moduleId);
  }

  subscriptionType = 'Monthly';
  subscriptionTypeChoices: any[] = ['Monthly', 'Quarterly', 'Half Yearly',"Yearly"];

  getAllDuration() {
    this._commonService.get(`PackageDuration`).subscribe(res => {
      this.subscriptionTypeChoices = res;
    })
  }
  openDialog(data?:any) {
    let subscriptionTypeId;
    this.subscriptionTypeChoices.filter(x => {
      if (x.duration === this.subscriptionType) {
        subscriptionTypeId = x.id
      }
    })
    let dialogRef = this.dialog.open(SubscriptionPlanFormComponent, {
      data: {
        data: data, 
        durationTypeList: this.subscriptionTypeChoices,
        subscriptionPlan: this.subscriptionType,
        durationId: subscriptionTypeId,
        organizationId: this.subId
      }
    });
  }
  updateOptionalLabel() {
    this._matStepperIntl.optionalLabel = this.subscriptionType;
    this._matStepperIntl.changes.next();
    this.updateFilteredPackageList();
  }

  updateFilteredPackageList() {
    this.packageList = this.packageRecords.map(data => ({
      ...data,
      price: this.calculatePrice(data.price, this.subscriptionType)
    }));
  }
  
  calculatePrice(basePrice: number, subscriptionType: string): number { 
    switch (subscriptionType) {
      case 'Monthly':
        return basePrice;
      case 'Quarterly':
        return basePrice * 3; 
      case 'Half Yearly':
        return basePrice * 6; 
      case 'Yearly':
        return basePrice * 12; 
      default:
        return basePrice;
    }
  }

  cancel() {
    this.router.navigate(['/organization-details'])
  }
}
