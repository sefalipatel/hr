import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AdminDashboardClientComponent } from '../demo/pages/admin-dashboard-client/admin-dashboard-client.component';
import { AdminDashboardTotalRevenueComponent } from '../demo/pages/admin-dashboard-total-revenue/admin-dashboard-total-revenue.component';
import { DashboardRecentProjectComponent } from "./dashboard-recent-project/dashboard-recent-project.component";
import { CommonService } from 'src/app/service/common/common.service';
import { AdminDashboardCompanyShiftComponent } from '../demo/pages/admin-dashboard-company-shift/admin-dashboard-company-shift.component';
import { Router } from '@angular/router';
import { CurrencyPipePipe } from '../../app/pipe/currency-pipe.pipe';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../theme/shared/shared.module';
declare const $: any;
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, SharedModule, CurrencyPipePipe, SlickCarouselModule, BaseChartDirective, AdminDashboardClientComponent, AdminDashboardTotalRevenueComponent, DashboardRecentProjectComponent, AdminDashboardCompanyShiftComponent]
})
export class AdminDashboardComponent {
  
  getALLStatistical: any;
  getALLEmployeeHR: any;
  getALLFeedbackSuggestion: any;
  getALLgetAllStatistics: any;
  getALLgetAllTaskStatistics: any;
  getALLAbsent: any;
  date: Date = new Date()
  dateFormat: string = localStorage.getItem('Date_Format');
  getALLJobInquiry: any;
  getAlljobInquiry: any;
  getAllcompanyShift: any;
  getAllexpense: any;
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: [
          'rgba(54, 166, 150, 0.2)'
        ],
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)'
        ],

      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels = [['No. of Genral shift employee'], ['No. of Night shift employee'], 'No. of Second shift employee'];
  public pieChartDatasets = [{
    data: [50, 50, 100],
    backgroundColor: [
      'rgb(153, 204, 255)',
      'rgb(255, 255, 153)',
      'rgb(255, 153, 204)'
    ],
    borderWidth: 0,
    hoverOffset: 4,
    hoverBorderColor: 'rgb(0, 204, 0)',
  }];
  public pieChartLegend = false;
  public pieChartPlugins = [];
  public attachmentUrl: string = environment.apiUrl.replace('api/', '')

  constructor(private commonservice: CommonService, private router: Router) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0)
    this.getAllStatisticalData()
    this.getAllEmployeeHR()
    this.getAllFeedbackSuggestion()
    this.getAllStatistics()
    this.getAllTaskStatistics()
    this.getAllAbsent()
    this.getAllJobInquiry()
    this.getAllCompanyShift()
    this.getAllExpense()
  }

  initializeSlickSlider(): void {
    setTimeout(() => {
      $('.feedback_slider').slick({
        infinite: true,
        slidesToScroll: 1,
        autoplay: true,       
        arrows: false,
        dots: false,
        vertical: true,
        slidesToShow: 3, // Set this to the number of slides you want to show at once
        cssEase: 'ease-out',
        touchMove: true,
        lazyLoad: 'ondemand',
        // useTransform: true, 
    });}, 500);
  }

  getAllStatisticalData() {
    this.commonservice.get(`AdminDashboard/StatisticalData`).subscribe((x) => {
      this.getALLStatistical = x.value
    })
  }

  getAllEmployeeHR() {
    this.commonservice.get(`AdminDashboard/EmployeeHR`).subscribe((x) => {
      this.getALLEmployeeHR = x.value
    })
  }
  getAllFeedbackSuggestion() {
    this.commonservice.get(`AdminDashboard/FeedbackSuggestion`).subscribe((x) => {
      this.getALLFeedbackSuggestion = x.value
      if (x) {
        setTimeout(() => {
          this.initializeSlickSlider();
        }, 0);
      }
    })
  }
  getAllStatistics() {
    this.commonservice.get(`AdminDashboard/Statistics`).subscribe((x) => {
      this.getALLgetAllStatistics = x.value
    })
  }
  getAllTaskStatistics() {
    this.commonservice.get(`AdminDashboard/TaskStatistics`).subscribe((x) => {
      this.getALLgetAllTaskStatistics = x.value
    })
  }
  getAllAbsent() {
    this.commonservice.get(`AdminDashboard/Absent`).subscribe((x) => {
      this.getALLAbsent = x.value
    })
  }
  getAllJobInquiry() {
    this.commonservice.get(`AdminDashboard/JobInquiry`).subscribe((x) => {
      this.getAlljobInquiry = x.value
    })
  }
  getAllCompanyShift() {
    this.commonservice.get(`AdminDashboard/CompanyShift`).subscribe((x) => {
      this.getAllcompanyShift = x.value
    })
  }
  getAllExpense() {
    this.commonservice.get(`AdminDashboard/Expense`).subscribe((x) => {
      this.getAllexpense = x.value
    })
  }
  convertPriority(value) {
    const status = ['paid', 'unpaid'];
    let list = status.filter((item, index) => index == value);
    return list;
  }
  navigate() {
    this.router.navigate(['employee-leave-details'])
  }
  nav() {
    this.router.navigate(['expense-details'])
  }

  navi() {
    this.router.navigate(['jobinquiry'])
  }
  getLeavewidth(value, totalValue): number {
    return Math.round(((+value ?? 0) / (+totalValue ?? 0)) * 100)
  }
  // Replace 'wwwroot\\' with an empty string to remove it from the file path
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }
  generateInitials(name: string): string {
    if (!name) return '';
    // Split the name into two parts (like, ["Karan", "Tandel"])
    const nameParts = name.split(' ');
    // Take the first letter from each part and join them (like, "KT")
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
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
}
