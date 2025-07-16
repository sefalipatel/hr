// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { NavigationComponent } from './theme/layouts/admin/navigation/navigation.component';
import { NavBarComponent } from './theme/layouts/admin/nav-bar/nav-bar.component';
// import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layouts/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layouts/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavigationItem } from './theme/layouts/admin/navigation/navigation';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
// import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import {
  MsalModule,
  MsalRedirectComponent,
  MsalGuard,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from "@azure/msal-angular";
import { BrowserCacheLocation, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { environment } from 'src/environments/environment';
import { AssetApiService } from './asset-api.service';
import { TemplateDetailComponent } from './template-detail/template-detail.component';
// import { TreeviewComponent } from './demo/pages/treeview/treeview.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DatePickerFormatDirective } from './directives/date-picker-format.directive';
import { DashboardPollComponent } from './demo/pages/dashboard-poll/dashboard-poll.component';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// import { NewProjectDetailPageComponent } from './demo/pages/Project/new-project-detail-page/new-project-detail-page.component';

// import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';


/**
 * Configuring the AAD login type and api related permissions
 * @returns AAD Guard configuration
 */
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ["user.read"]
    },
    loginFailedRoute: '/'
  }
}

/**
 * Interceptor configuration for the API calls
 * @returns
 */

export function MSALInterceptorConfig(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"])
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  }
}


const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    NavigationComponent,
    NavBarComponent,
    // NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent,
    TemplateDetailComponent,
    // TreeviewComponent,
    DatePickerFormatDirective,
    // NewProjectDetailPageComponent,
    // NewDashboardComponent
  ],
  imports: [
    NavLeftComponent,
    NgxMaterialTimepickerModule.setOpts('en'),
    SocialLoginModule,
    MatInputModule,
    FormsModule,
    BrowserModule,
    MatDialogModule,
    AppRoutingModule,
    SharedModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardPollComponent,
    HttpClientModule,
    MatProgressSpinnerModule,
    MsalModule.forRoot(new PublicClientApplication({
      auth: {
        clientId: "ad6e6a60-7b51-4ae5-bed6-c8bebce622f6",
        authority: "https://login.microsoftonline.com/36e1c069-10f4-4c1f-b618-b20887b47691", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: environment.redirectURL,
        postLogoutRedirectUri: '/'
      },
      cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage,
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      },
      system: {
        allowNativeBroker: false, // Disables WAM Broker
        loggerOptions: {
          logLevel: LogLevel.Info,
          piiLoggingEnabled: false
        }
      }
    }), {
      interactionType: InteractionType.Redirect, // MSAL Guard Configuration
      authRequest: {
        scopes: ["user.read"],
      },
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([
        ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
      ]),
    }),
    LoaderComponent
  ],

  providers: [NavigationItem, DatePipe, MsalGuard, AssetApiService, provideCharts(withDefaultRegisterables()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfig
    },
    MsalService,
    MsalGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true, //keeps the user signed in
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('190779846919-r1qbk0c45r6cpq0pqn78jfej04bqbnca.apps.googleusercontent.com', {
              scopes: 'openid profile email',
            }) // your client id
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }],
  // providers: [
  //   provideAnimationsAsync(),
  //   provideCharts(withDefaultRegisterables())
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
