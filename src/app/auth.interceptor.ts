import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { LoaderService } from './service/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  personId: { personID: string; token };
  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.loaderService.show();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = JSON.parse(localStorage.getItem('userInfo'))?.token;
    const personID = JSON.parse(localStorage.getItem('userInfo'))?.personID; // Fetch personID
    const excludedUrls = [
      'Notification/NotificationByPersonId',
      'Attendance/CheckIn',
      'AttendanceDetails/DashboardBottomTimeLine',
      'Attendance/minutes',
      'Attendance/userHours',
      'Ticket/UserTicketListStatistics',
      'ProjectMembers/project',
      'ProjectMembers',
      'check-in/'
    ];

    if (authToken) {
      let headers = {
        Authorization: `Bearer ${authToken}`
      };

      // Add personID if available
      if (personID) {
        headers['personID'] = personID;
      }

      // Clone the request and attach headers
      const authReq = request.clone({ setHeaders: headers });

      let decodedToken = jwtDecode(authToken);
      const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;

      if (isExpired) {
        localStorage.clear();
        this.router.navigate(['/home']);
        this.loaderService.hide(); // Hide loader immediately when token expires
        return next.handle(authReq); // Return empty observable to stop execution
      }

      const isExcluded = excludedUrls.some((url) => request.url.includes(url));

      if (!isExcluded) {
        this.loaderService.show();
      }

      // Show Loader for Every API Call (GET, POST, PUT, DELETE)**
      // this.loaderService.show();

      return next.handle(authReq).pipe(
        finalize(() => {
          if (!isExcluded) {
            this.loaderService.hide();
          }
        })
      );
    } else {
      this.loaderService.hide(); // Hide loader if no token is found
    }

    return next.handle(request).pipe(
      finalize(() => this.loaderService.hide()) // Ensure loader hides after API call
    );
  } 
}
