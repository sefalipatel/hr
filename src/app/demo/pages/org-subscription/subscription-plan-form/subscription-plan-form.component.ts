import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepperIntl } from '@angular/material/stepper';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None, 
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './subscription-plan-form.component.html',
  styleUrls: ['./subscription-plan-form.component.scss']
})
export class SubscriptionPlanFormComponent implements OnInit {

  public planData: any[] = [];
  public subPlanData: any[] = [];
  public subscriptionType = '';
  public subscriptionTypeId: string = '';
  public finalPrice: number; 
  subscriptionTypeChoices: any[] = [];
  basePrice;
  monthlyPrice=0;

  constructor(private formBuilder: FormBuilder,
    private _matStepperIntl: MatStepperIntl, private _commonService: CommonService, private datePipe: DatePipe, 
    public dialogRef: MatDialogRef<SubscriptionPlanFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: any, durationTypeList: any, subscriptionPlan: any, durationId: any, organizationId: any},
  ) {
    this.planData = [data.data];
    this.subPlanData = [data.data];
    this.subscriptionTypeChoices = data.durationTypeList;
    this.subscriptionType = data.subscriptionPlan;
    this.basePrice = data.data.price;
    this.monthlyPrice = this.subscriptionType == 'Yearly' ?  data.data.price/12 :
    this.subscriptionType == 'Half Yearly' ?  data.data.price/6 :
    this.subscriptionType == 'Quarterly' ?  data.data.price/3 : data.data.price;
  }

  ngOnInit(): void {
  }

  updateOptionalLabel() {
    this._matStepperIntl.optionalLabel = this.subscriptionType;
    this._matStepperIntl.changes.next();
    this.updateFilteredPackageList();
    
    this.subscriptionTypeChoices.filter(x => {
      if (x.duration === this.subscriptionType) {
        this.subscriptionTypeId = x.id
      }
    })
  }

  updateFilteredPackageList() {
    this.planData = this.subPlanData.map(data => ({
      ...data,
      price: this.calculatePrice(data.price, this.subscriptionType),
    }));
  }
  
  calculatePrice(basePrice: number, subscriptionType: string): number {

    basePrice = this.monthlyPrice;

    switch (subscriptionType) {
      case 'Monthly':
        return basePrice;
      case 'Quarterly':
        return basePrice * 3 ; 
      case 'Half Yearly':
        return basePrice * 6 ; 
      case 'Yearly':
        return basePrice * 12 ; 
      default:
        return basePrice;
    }
  }

  calculateFinalPrice(price) {
    this.finalPrice = ((+price) + (+price * 0.18));
    return this.finalPrice;
  }

  pay() {
    let payload = {
      packageId: this.data?.data.id,
      price: this.finalPrice,
      packageDurationId: this.subscriptionTypeId ? this.subscriptionTypeId : this.data.durationId,
      organizationId: this.data?.organizationId
    }
    
    this._commonService.post(`Package/Pay`, payload).subscribe(res => {
      if (res) {
        this._commonService.showToast('Payment processed successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.dialogRef.close();
      }
    }, (err) => {
      this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
    })
  }
}
