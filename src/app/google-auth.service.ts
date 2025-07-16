/*
*Author : Manikandan Maheswaran
*email : m.manikandanmct@gmail.com
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
// import { CommonHttpService } from './common-http.service';
declare const gapi: any;
@Injectable()
export class GoogleAuthenticationService {
  constructor( private router: Router) { }
  /**
* Calling Google login API and fetching account details.
* @param callback Callback to function
*/
  public authenticateUser(clientId: any, callback: any) {
    let auth2: any;
    let result: any;
    let router = this.router;
    // let commonService = this._commonService;
    gapi.load('auth2', function () {
      auth2 = gapi
        .auth2
        .init({ client_id: clientId, scope: 'profile email' });
      //Login button reference
      let element: any = document.getElementById('google-login-button');
      auth2.attachClickHandler(element, {}, function (googleUser: any) {
        //Getting profile object
        let profile = googleUser.getBasicProfile();

        //Setting data to localstorage.        
        localStorage.setItem('token', googleUser.getAuthResponse().id_token);
        localStorage.setItem('image', profile.getImageUrl());
        localStorage.setItem('name', profile.getName());
        localStorage.setItem('email', profile.getEmail());
        let logInData = {
          Email: profile.getEmail(),
          FirstName: profile.getGivenName(),
          LastName: profile.getFamilyName(),
          Logintype: 1
        } 
        callback.emit(googleUser);
        // router.navigate(['./bank-e-auction/dashboard']);


      }, function (error: any) {
        // alert(JSON.stringify(error, undefined, 2));
      });
    });
  }
  /**
* Logout user from Google
* @param callback Callback to function
*/
  userLogout(callback?: any) {
    //You will be redirected to this URL after logging out from Google.
    let homeUrl = "http://localhost:4200/";
    let logoutUrl = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah" +
      "/logout?continue=" + homeUrl;
    document.location.href = logoutUrl;

    // callback();
  }
}