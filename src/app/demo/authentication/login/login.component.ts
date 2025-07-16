// angular import
import { Component, Inject, OnInit, OnDestroy, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { Subject, Subscription, } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from "jwt-decode";
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Organization, ToastType } from '../../models/models';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

declare global {
  interface Window {
    google: any;
  }
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MatInputModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class LoginComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;
  emailId: string
  form: FormGroup
  // title = 'skytus-hr';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  private isMsalInitialized = false;
  password = 'Password';
  show = false;
  public getAuthList: any;
  public customAuthList: any;
  public googleAuthList: any;
  public microsoftAuthList: any;
  public TFAEnabled: boolean = false;
  title: string = '';
  favicon:string = '';
  public imageUrl: string = environment.apiUrl.replace('api/', '');
  @Output() loginWithGoogle: EventEmitter<any> = new EventEmitter<any>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private authService: MsalService, private apiservice: ApiService, private router: Router, private toastr: ToastrService,
    private formBuilder: FormBuilder, private AuthGoogleLOgin: SocialAuthService, private commonService: CommonService,private _title:Title, private zone: NgZone) {

    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
      },
      error: (error) => {
      },
    });

    this.form = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ["", Validators.required]
    })
  }
  ngOnInit(): void {
    if (!this.isMsalInitialized) {
      this.authService.instance
        .handleRedirectPromise()
        .then(() => {
          this.isMsalInitialized = true;
        })
        .catch((error) => {
          this.apiservice.showToast("MSAL initialization error", ToastType.ERROR, ToastType.ERROR)
        });
    }
    if (this.authService.instance.getAllAccounts().length > 0) {
    }
    this.getAllAuth();
  }
  ngOnDestroy(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }

  async login() {
    try {
      const result = await this.authService.loginPopup({ scopes: ['user.read'] }).toPromise();
      this.emailId = result.account.username;
      const fromdata = {
        email: this.emailId,
        password: "",
        accessToken: result?.accessToken
      }
      // const response = await this.apiservice.loginApi(fromdata);

      if (this.TFAEnabled){ 
        const headers = {'X-API-Key': environment.XAPIKey };
        this.commonService.post('auth/microsoft2FA', fromdata, { headers }).subscribe((res) => {        
          if (res.statusCode == 400) {
            this.toastr.error(res.errors[0].errorMessage)
            setTimeout(() => {
              this.authService.logout()
              localStorage.clear()
            }, 1000)
            return;
          }
          let response = { value: res }; 
          localStorage.setItem('personCode', response?.value?.personCode);
          localStorage.setItem('is2FA', response?.value?.is2FA);
          localStorage.setItem('isCaptured', response?.value?.isCaptured);
          localStorage.setItem('encryptionId', response?.value?.encryptionId);
          localStorage.setItem('userEmail',response?.value?.email);
          // localStorage.setItem('loginType', "1");//Microsoft Login type

          if (response.value?.is2FA) {
            this.router.navigate(['/two-factor-authenticaton'])
            return;
          }
        })
      }

      else {
        this.commonService.post('auth/microsoft', fromdata).subscribe((res) => {
          if (res.statusCode == 400) {
            this.toastr.error(res.errors[0].errorMessage)
            setTimeout(() => {
              this.authService.logout()
              localStorage.clear()
            }, 1000)
            return;
          }
          let response = { value: res };
          const decoded = jwtDecode(response?.value?.token) as { organizationId: string };
          const role = jwtDecode(response?.value?.token) as { roleName: string };
          localStorage.setItem('token', response?.value.token);
          localStorage.setItem('orgId', decoded?.organizationId);
          localStorage.setItem('roleName', role?.roleName);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.value.token ?? localStorage.getItem('token')}`;
          const userInfo = {
            name: response?.value?.personName,
            email: response?.value?.email,
            username: response?.value?.personName,
            personID: response?.value?.personId,
            token: response?.value?.token,
            personRole: response?.value?.personRole,
            loginType: response?.value?.loginType,
            // LastCheckInOutStatus:response?.value?.lastCheckInOutStatus
          };
          localStorage.setItem("LastCheckInOutStatus", JSON.stringify(response?.value?.lastCheckInOutStatus))
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('userRole', JSON.stringify(response?.value));
          let IsPolicyConcern = JSON.parse(localStorage.getItem('userRole')).isPolicyConsent; 

          if (response.value?.token !== null) {
            if (IsPolicyConcern == false || IsPolicyConcern == null) {
              this.router.navigate(['/company-policy'])
            }
            else {
              this.zone.run(() => {
                this.router.navigate(['/dashboard']);
              }); 
            }
          }
        })
      }
    }
    catch (error) {
      this.apiservice.showToast("Login error", ToastType.ERROR, ToastType.ERROR)
    }
  }
  async customLogin() {
    if (this.form.valid) {
      const fromdata = {
        Email: this.emailId,
        password: ""
      }
      if (this.TFAEnabled){
        const headers = {'X-API-Key': environment.XAPIKey };
        this.commonService.post('auth/2FA', this.form.value, { headers }).subscribe((res) => {        
          if (res.statusCode == 400) {
            this.toastr.error(res.errors[0].errorMessage)
            setTimeout(() => {
              this.authService.logout()
              localStorage.clear()
            }, 1000)
            return;
          }
          let response = { value: res }; 
          localStorage.setItem('personCode', response?.value.value?.personCode);
          localStorage.setItem('is2FA', response?.value.value?.is2FA);
          localStorage.setItem('isCaptured', response?.value.value?.isCaptured);
          localStorage.setItem('encryptionId', response?.value.value?.encryptionId);
          localStorage.setItem('userEmail',response?.value?.email)
          // localStorage.setItem('loginType', "3");//Custom Login type

          if (response.value.value?.is2FA) {
            this.router.navigate(['/two-factor-authenticaton'])
            return;
          }
          if (response.value.value?.message !== null && response.value.value?.message !== undefined) {
            this.toastr.error(response.value.value?.message);
            setTimeout(() => {
              this.authService.logout()
              localStorage.clear()
            })
            return;
          }
        })
      }
      else{
        const response = await this.apiservice.loginApi(this.form.value);
        if (response.statusCode == 400) {
          this.toastr.error(response.errors[0].errorMessage)
        }
        const decoded = jwtDecode(response?.value?.token) as { organizationId: string };
        localStorage.setItem('token', response?.value.token);

        localStorage.setItem('orgId', decoded?.organizationId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.value.token ?? localStorage.getItem('token')}`;

        const userInfo = {
          name: response?.value?.personName,
          username: response?.value?.personName,
          personID: response?.value?.personId,
          token: response?.value?.token,
          personRole: response?.value?.personRole,
          loginType: response?.value?.loginType,
          email: response?.value?.email,
          LastCheckInOutStatus: response?.value?.lastCheckInOutStatus
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('userRole', JSON.stringify(response?.value));
        let IsPolicyConcern = JSON.parse(localStorage.getItem('userRole')).isPolicyConsent;
        if (response.value?.token !== null) {
          if (IsPolicyConcern == false || IsPolicyConcern == null) {
            this.router.navigate(['/company-policy'])
          }
          else {
            this.zone.run(() => {
              this.router.navigate(['/dashboard']);
            }); 
          }
        }
      }

    } else {
      this.form.markAllAsTouched()
    }
  }
  catch(error) {
    this.apiservice.showToast("Login error", ToastType.ERROR, ToastType.ERROR)
  }

  createFakeGoogleWrapper = () => {
    const googleLoginWrapper = document.createElement('div');
    googleLoginWrapper.style.display = 'none';
    googleLoginWrapper.classList.add('custom-google-button');
    document.body.appendChild(googleLoginWrapper);
    window.google.accounts.id.renderButton(googleLoginWrapper, {
      type: 'icon',
      width: '200',
    });

    const googleLoginWrapperButton = googleLoginWrapper.querySelector(
      'div[role=button]'
    ) as HTMLElement;

    return {
      click: () => {
        googleLoginWrapperButton?.click();
      },
    };
  };

  handleGoogleLogin(): void {

    const googleWrapper = this.createFakeGoogleWrapper();
    googleWrapper.click();
    this.authSubscription = this.AuthGoogleLOgin.authState.subscribe(async (user) => {
      if (user) {
        const fromdata = {
          Email: user.email,
        }
        if (this.TFAEnabled){ 
          const headers = {'X-API-Key': environment.XAPIKey };
          this.commonService.post('auth/2FA', fromdata, { headers }).subscribe((res) => {        
            if (res.statusCode == 400) {
              this.toastr.error(res.errors[0].errorMessage)
              setTimeout(() => {
                this.authService.logout()
                localStorage.clear()
              }, 1000)
              return;
            }
            let response = { value: res }; 
            localStorage.setItem('personCode', response?.value?.personCode);
            localStorage.setItem('is2FA', response?.value?.is2FA);
            localStorage.setItem('isCaptured', response?.value?.isCaptured);
            localStorage.setItem('encryptionId', response?.value?.encryptionId);
            localStorage.setItem('userEmail',response?.value?.email)
            // localStorage.setItem('loginType', "2");//Google Login type

            if (response.value?.is2FA) {
              this.router.navigate(['/two-factor-authenticaton'])
              return;
            }
          })
        }
        else{
          const response = await this.apiservice.loginApi(fromdata);

          localStorage.setItem('loginType', response?.value?.loginType)
          if (response.statusCode == 400) {
            this.toastr.error(response.errors[0].errorMessage)
            setTimeout(() => {
              this.AuthGoogleLOgin.signOut();
              localStorage.clear()
            }, 1000)
          }
          const decoded = jwtDecode(response?.value?.token) as { organizationId: string };

          localStorage.setItem('token', response?.value.token);
          localStorage.setItem('orgId', decoded?.organizationId);

          axios.defaults.headers.common['Authorization'] = `Bearer ${response.value.token ?? localStorage.getItem('token')}`;
          const userInfo = {
            name: response?.value?.personName,
            email: response?.value?.email,
            username: response?.value?.personName,
            personID: response?.value?.personId,
            token: response?.value?.token,
            personRole: response?.value?.personRole,
            loginType: response?.value?.loginType,
            LastCheckInOutStatus: response?.value?.lastCheckInOutStatus
          };

          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('userRole', JSON.stringify(response?.value));
          if (response.value?.token !== null) {
            this.router.navigate(['/dashboard']);
          }
        }        
      }
    });
  }

  onNewClick() {
    if (this.password === 'Password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'Password';
      this.show = false;
    }
  } 

  getAllAuth() {
    this.commonService.get('OrganizationAuthentication').subscribe(
        res => {

            if (!Array.isArray(res?.value)) {
                console.error('Invalid API response: Expected an array');
                return;
            }

            const authData = res?.value;

            this.customAuthList = authData?.find(x => x.authenticationtype === 3) || null;
            this.googleAuthList = authData?.find(y => y.authenticationtype === 2) || null;
            this.microsoftAuthList = authData?.find(z => z.authenticationtype === 1) || null;

            // Extract title and logo
            const organizationData = authData?.find(item => item.authenticationtype === 1);
            if (organizationData) {
                this.TFAEnabled = organizationData.is2FA || false;
                this.title = organizationData.title || '';
                this.favicon = organizationData.favicon
                    ? `${environment.apiUrl.replace('/api', '')}${organizationData.favicon.replace(/\\/g, '/')}`
                    : '';
                localStorage.setItem("timer",organizationData.timer);
                localStorage.setItem("counter",organizationData.counter);
                localStorage.setItem("isCaptured",organizationData.isCaptured);
            } else {
                console.warn('Organization data not found for authenticationType 1.');
            }
        },
        error => {
            console.error('API Error:', error);
        }
    );
  }

}