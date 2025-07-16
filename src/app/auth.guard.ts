import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
// import { SidebarService } from '../core/core.index';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public side_bar_data: Array<any> = [];

  constructor(private router: Router) {
    // this.side_bar_data = this.sidebar.sidebarData1;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let userPermissions = JSON.parse(localStorage.getItem('userRole')); 
    const authToken = JSON.parse(localStorage.getItem('userInfo'))?.token;
    let isExpaired=false;
    if(authToken){
      let decodeToken=jwtDecode(authToken)
      isExpaired=decodeToken && decodeToken.exp?decodeToken.exp<Date.now()/1000:false;
    }

    if (localStorage.getItem('token') && (authToken &&!isExpaired)) {
      return true;
    }
    else {
      this.router.navigate(['/home']);
      return false;
    }

  }

}
