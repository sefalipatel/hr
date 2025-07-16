import { Component, NgZone } from '@angular/core';
import { SkyHRConfig } from 'src/app/app-config';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  navCollapsed;
  navCollapsedMob: boolean;
  windowWidth: number;
  orgId:string = '';

  constructor(private _commonService:CommonService) {
    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1024 ? SkyHRConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;
    this.getOrgSetting();
  }

  navMobClick() {
    if (this.navCollapsedMob && !document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  
  getOrgSetting(){
    this.orgId = localStorage.getItem('orgId');
    this._commonService.get(`OrganizationSetting/settings/${this.orgId}`).subscribe((res: any[]) => {
      localStorage.setItem('Date_Format',res?.find(x=>x.titleKey == 'Date_Format')?.value)
      localStorage.setItem('Time_Format',res?.find(x=>x.titleKey == 'Time_Format')?.value)
    });
  }
}
