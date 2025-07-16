import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum NotificationType {
  Expense = 0,
  Loan = 1,
  CompanyPolicy = 2,
  ProjectAssign = 3,
  EmployeeInsurance = 4,
  UserLeave = 5,
  UserRequest = 6,
  AssetsAllocation = 7,
  AssetCarryToHome = 8,
  TicketAssign = 9,
  Suggestion = 10,
  TaskAssign = 11,
  Advance = 12,
  AdminLeaveRequest = 13,
  RegularizationRequest = 14
}
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public addDetails: any;
  public addNotification: any;
  public myNotification: any;

  constructor(
    private api: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bellClick();
  }

  bellClick() {
    let requestId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.api.get(`Notification/NotificationByPersonId/${requestId}`).subscribe((res) => {
      this.addDetails = res?.value;
      this.addNotification = res?.value?.notifications;
    });
  }

  readNotification(event) {
    const id = this.addNotification.map((item) => {
      return item.id;
    });
    this.api.put(`Notification/${event?.notificationType}/readNotification/true`, '').subscribe((res) => {
      this.myNotification = res;
      switch (event?.notificationType) {
        case NotificationType.Expense:
          this.router.navigate(['expense-details']);
          break;
        case NotificationType.Loan:
          this.router.navigate(['employee-loan-details']);
          break;
        case NotificationType.CompanyPolicy:
          this.router.navigate(['company-policy']);
          break;
        case NotificationType.ProjectAssign:
          this.router.navigate(['project-details']);
          break;
        case NotificationType.EmployeeInsurance:
          this.router.navigate(['employee-insurance-details']);
          break;
        case NotificationType.UserLeave:
          this.router.navigate(['leave-details']);
          break;
        case NotificationType.UserRequest:
          this.router.navigate(['employee-request-details']);
          break;
        case NotificationType.AssetsAllocation:
          this.router.navigate(['user-profile'], { queryParams: { tab: 'asset' } });
          break;
        case NotificationType.AssetCarryToHome:
          break;
        case NotificationType.TicketAssign:
          this.router.navigate(['ticket-new']);
          break;
        case NotificationType.Suggestion:
          this.router.navigate(['feedback-suggestions']);
          break;
        case NotificationType.TaskAssign:
          this.router.navigate(['project-dashboard']);
          break;
        case NotificationType.Advance:
          this.router.navigate(['advance-salary']);
          break;
        case NotificationType.AdminLeaveRequest:
          this.router.navigate(['employee-leave-details']);
          break;
        case NotificationType.RegularizationRequest:
          this.router.navigate(['employee-timeupdate-request']);
          break;
        default:
          break;
      }
    });
  }

  onHistory() {
    this.router.navigate(['notification-history']);
  }
}
