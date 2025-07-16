import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { userRole } from 'src/app/assets.model';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',

  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  avatar1 = "/broken-image.jpg";
  userInfo: any;
  public userRole: Array<userRole> = [];
  loginType = JSON.parse(localStorage.getItem('userInfo'))?.loginType;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  userPicture: string = '';

  constructor(private router: Router, private authService: MsalService, private AuthGoogleService: SocialAuthService,
    private _commonService: CommonService) {
    this._commonService.profilePicture$.subscribe(picture => {
      this.userPicture = localStorage.getItem('profilePicture');
    })
  }

  profile = [
    {
      icon: 'ti ti-power',
      title: 'Logout',
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Employee";
      })
    }

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

    localStorage.removeItem('userRole');
  }
  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.close(); // Close the dropdown using its reference
    }
  }
  userProfile(personID) { 
  }
  stringToColor(string: any) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return string?.length ? color : '#bfbfbf';
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
}
