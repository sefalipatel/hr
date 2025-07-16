// Angular import
import { Component, EventEmitter, NgZone, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { MsalService } from '@azure/msal-angular';
// project import
import { NavigationItem } from '../navigation';
import { SkyHRConfig } from 'src/app/app-config';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { userRole } from 'src/app/assets.model';
import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavContentComponent implements OnInit {
  userInfo: any;
  public userRole: Array<userRole> = [];


  // public props
  @Output() NavCollapsedMob: EventEmitter<string> = new EventEmitter();

  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigation;
  windowWidth = window.innerWidth;
  profileData: any[] = [];


  // Constructor
  constructor(
    private commonService: CommonService,
    private authService: MsalService,
    private router: Router,
    public nav: NavigationItem,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private AuthGoogleService: SocialAuthService,
  ) {
    this.windowWidth;
    this.navigation = this.nav.get();
    this.navigation[0].children = this.navigation[0].children.map(x => {
      if (x.children?.length && x.type == 'collapse')
        x.children = x.children.filter(m => this.checkModuleAccess(m))
      return x;
    })
    
  }

  // Life cycle events
  ngOnInit() {
    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Employee";
      })
    }
    this.getProfileData();
  }
  public getProfileData() {
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.commonService.get(`person/userdetail`).subscribe(res => {
      this.profileData = res;

    });
  }
  async logout() {
    const LoginType = JSON.parse(localStorage.getItem('userInfo'))
    if (LoginType.loginType === 3) {
      localStorage.clear()
      this.router.navigate(['/home'])
    }
    else if (LoginType.loginType === 2) {
      this.AuthGoogleService.signOut();
      localStorage.clear()
      this.router.navigate(['/home'])
    }
    else {
      try {
        this.logoutAllAccounts()
        await this.authService.logout();
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.clear()
      } catch (error) {
      }
    }
  }
  async logoutAllAccounts() {
    try {
      const allAccounts = this.authService.instance.getAllAccounts();

      if (allAccounts.length > 0) {

        for (const account of allAccounts) {
          await this.authService.logout({
            account: account,
          });
        }
      };
    }
    catch (error) {
    }
  }
  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }

  checkModuleAccess(module) {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    let isDisplay = false;
    let role = localStorage.getItem('roleName');

    if (module.type == 'collapse') {
      module?.children.map((submenu) => {
        userPermissions?.accessPermission?.map((item) => {
          const subModuleTitle = submenu?.menuValue.toLowerCase();//.replace(/[\W_]+/g, '');
          const itemTitle = item?.module?.module.toLowerCase();//.replace(/[\W_]+/g, '');
          if (subModuleTitle == '') {
            isDisplay = true;
          } else {
            if (subModuleTitle == itemTitle) {
              if (item.canAdd || item.canDelete || item.canEdit || item.canView) {
                isDisplay = true;
              }
            }
          } 
        });
      });
      return isDisplay;
    } else {
      userPermissions?.accessPermission?.map((item) => {
        const moduleTitle = module.menuValue.toLowerCase();//.replace(/[\W_]+/g, '');
        const itemTitle = item?.module?.module.toLowerCase();//.replace(/[\W_]+/g, '');

        if (moduleTitle == '') {
          isDisplay = true;
        } else {
          if (moduleTitle == itemTitle) { 
            if (item.canAdd || item.canDelete || item.canEdit || item.canView) {
              isDisplay = true;
            }
          }
        }
      });
      return isDisplay;
    }
  }
}
