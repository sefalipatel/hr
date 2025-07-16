import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-organization-setting-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './organization-setting-form.component.html',
  styleUrls: ['./organization-setting-form.component.scss']
})
export class OrganizationSettingFormComponent implements OnInit {

  organizationList: any[] = [];
  orgSettingForm: FormGroup;
  orgFormArray: FormGroup[] = []; 
  workingDaysList: Array<any> = [
    {name: "Monday"},
    {name: "Tuesday"},
    {name: "Wednesday"},
    {name: "Thursday"},
    {name: "Friday"},
    {name: "Saturday"},
    {name: "Sunday"},
  ];
  monthList: Array<any> = [
    {value:"1", name: "January"},
    {value:"2", name: "Feruary"},
    {value:"3", name: "March"},
    {value:"4", name: "April"},
    {value:"5", name: "May"},
    {value:"6", name: "June"},
    {value:"7", name: "July"},
    {value:"8", name: "August"},
    {value:"9", name: "September"},
    {value:"10", name: "October"},
    {value:"11", name: "November"},
    {value:"12", name: "December"},
  ];
  timeFormatList: Array<any> = [
    {value:1, name: "HH:mm"},
    {value:2, name: "HH:mm a"},
  ];
  dateFormatList: Array<any> = [
    {value:1, name: "dd-MM-yyyy"},
    {value:2, name: "dd-MM-yy"},
    {value:3, name: "yyyy-MM-dd"},
    {value:4, name: "dd MMMM yyyy"},
  ];
  orgSettingId: string = '';
  organizationId: string = '';
  organizations: any;
  titleKey: string = '';
  serialNumber: any;
  submitted: boolean;
  
  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private _commonService: CommonService) {
    this.orgSettingForm = this.buildForm();
    this.submitted = false;
  }
  
  ngOnInit(): void {
    this.getAllOrganizationData();
  }

  getAllOrganizationData(isRoute:boolean=false) {
    this.orgSettingId = this.activeRoute.snapshot.params['id'] ?? '';

    this._commonService.get(`OrganizationSetting/settings/${this.orgSettingId}`).subscribe((res: any[]) => {
      this.organizationList = res;
      this.organizationList.forEach(item => {
        this.orgSettingForm.addControl(item?.titleKey, new FormControl(item.titleKey === 'Working_Days' ? item?.value?.split(",") : item?.value,
        item.titleKey != 'Working_Days' && item.titleKey != 'FinancialYear_Month' && item.titleKey != 'Time_Format'  && item.titleKey != 'Date_Format' ? [Validators.pattern(`^([0-9]+(\.[0-9]+)?)|([a-zA-Z]+)|^[a-zA-Z0-9@$&]+$`)] : [] ))

        if(isRoute){
          if(this.orgSettingId == localStorage.getItem('orgId')){
            localStorage.setItem('Date_Format',res?.find(x=>x.titleKey == 'Date_Format')?.value)
            localStorage.setItem('Time_Format',res?.find(x=>x.titleKey == 'Time_Format')?.value)
          }
            this.router.navigate(['organization-details']);
        }
      });
    });
  }

  buildForm() {
    return this._fb.group({ })
  }
  public get getFormFormControl() {
    return this.orgSettingForm.controls;
  }

  submitOrganization() {
    this.submitted = true;
    if (this.orgSettingForm.invalid) {
      this.orgSettingForm.markAllAsTouched();
      return;
    }
    this.organizationList = this.organizationList.map(item => {
      item.value = item.titleKey === 'Working_Days'?  this.orgSettingForm.value[item.titleKey]?.toString() : this.orgSettingForm.value[item.titleKey];
      return item;
    })
    
    if (this.orgSettingId) {
      this._commonService.put(`OrganizationSetting/update`, this.organizationList).subscribe(res => {
        this._commonService.showToast('Organization Setting Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.orgSettingForm.reset();
       this.getAllOrganizationData(true);
      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  onList() {
    this.router.navigate(['organization-details']);
  }
}
