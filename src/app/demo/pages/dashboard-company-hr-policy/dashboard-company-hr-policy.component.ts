import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard-company-hr-policy',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, RouterModule],
  templateUrl: './dashboard-company-hr-policy.component.html',
  styleUrls: ['./dashboard-company-hr-policy.component.scss']
})
export class DashboardCompanyHRPolicyComponent {
  getALLDataLave: any;
  personId: any
  public getAllUserWarning: any;
  public getFeedbackData: any;

  constructor(private commonservice: CommonService, private router: Router) {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
  }

  ngOnInit() {
    this.getAllCompanyPolicy();
    this.getAllWarning();
    this.getUserSuggestion();
  }
  getAllCompanyPolicy() {
    this.commonservice.get(`CompanyPolicy/companyPolicyByPersonId/${this.personId}`).subscribe((x) => {
      this.getALLDataLave = x
    })
  }
  onList() {
    this.router.navigate(['/company-policy'])
  }

  List() {
    this.router.navigate(['/companyprofile'])
  }
  getAllWarning() {
    this.commonservice.get('Warning/GetWarningByEmployee').subscribe(res => {
      this.getAllUserWarning = res?.value;
    })
  }

  btnClick() {
    this.router.navigate(['user/warning-details']);
  }

  getUserSuggestion() {
    this.commonservice.get(`Suggestion/GetMySuggetions`).subscribe(res => {
      this.getFeedbackData = res;
    })
  }
}
