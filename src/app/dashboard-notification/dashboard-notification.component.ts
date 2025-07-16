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
  AssetCarryToHome = 8
}

@Component({
  selector: 'app-dashboard-notification',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './dashboard-notification.component.html',
  styleUrls: ['./dashboard-notification.component.scss']
})
export class DashboardNotificationComponent {

  public notificationData: any[] = [];
  public myNotification: any;

  constructor(private api: CommonService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getAllNotification();
  }

  getAllNotification() {
    let requestId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.api.get(`Notification/NotificationByPersonId/${requestId}`).subscribe(res => {
      this.notificationData = res?.value?.notifications;
    })
  }
  
  readNotification(event) {
    const id = this.notificationData.map(item => {
      return item.id;
    })
    this.api.put(`Notification/${event?.notificationType}/readNotification/true`, '').subscribe(res => {
      this.getAllNotification();
    })
  }
}
