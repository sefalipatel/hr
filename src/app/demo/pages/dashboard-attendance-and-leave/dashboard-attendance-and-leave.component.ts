import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';

@Component({
  selector: 'app-dashboard-attendance-and-leave',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './dashboard-attendance-and-leave.component.html',
  styleUrls: ['./dashboard-attendance-and-leave.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardAttendanceAndLeaveComponent implements OnInit {
  public totalLeave: number = 0;
  public takenLeave: number = 0;
  public absentLeave: number = 0;
  public pendingLeave: number = 0;
  public cutLeave: number = 0;
  public workingDays: number = 0;
  public selectedYear: number;
  public selectedMonth: number;
  public years: number[] = [];
  public totalLeaveBlance: any;
  public personId: { personID: string }

  constructor(
    private _commonService: CommonService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 3; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() - 1;
    this.selectedYear = currentDate.getFullYear();
    this.onYearSelection(currentYear)
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.getLeaveBlance();
  }

  async onYearSelection(year) {
    this.selectedYear = year;
    this.totalLeave = 0
    this.takenLeave = 0;
    this.absentLeave = 0;
    this.pendingLeave = 0;
    this.cutLeave = 0;
    this.workingDays = 0;
    this._commonService.get(`Attendance/userAttendance/${this.selectedYear}`).subscribe(res => {
      res.map(x => {
        this.totalLeave = x?.totalLeave;
        this.takenLeave = x?.takenLeave;
        this.absentLeave = x?.absentLeave;
        this.pendingLeave = x?.pendingLeave;
        this.cutLeave = x?.cutLeave;
        this.workingDays = x?.workingDays;
      })
    })
  }

  onApplyLeave() {
    this.router.navigate(['new-leave-detail']);
  }
  getLeaveBlance() {
    this._commonService.get(`EmployeeLeave/${this.personId.personID}/leavebalance`).subscribe((x) => {
      this.totalLeaveBlance = x.carryForwardLeave
    })
  }
}