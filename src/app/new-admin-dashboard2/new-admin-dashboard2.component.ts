import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, } from 'chart.js';
import { environment } from 'src/environments/environment';
import { CommonService, ToastType } from '../service/common/common.service';
import { Router } from '@angular/router';
import { SharedModule } from '../theme/shared/shared.module';
import { CurrencyPipePipe } from '../../app/pipe/currency-pipe.pipe';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardRecentProjectComponent } from '../admin-dashboard/dashboard-recent-project/dashboard-recent-project.component';
import { AdminDashboardClientComponent } from '../demo/pages/admin-dashboard-client/admin-dashboard-client.component';
import { AdminDashboardCompanyShiftComponent } from '../demo/pages/admin-dashboard-company-shift/admin-dashboard-company-shift.component';
import { AdminDashboardTotalRevenueComponent } from '../demo/pages/admin-dashboard-total-revenue/admin-dashboard-total-revenue.component';
import { SweetalertService } from '../demo/pages/role-list/sweetalert.service';
import { TimeAgoPipe } from '../demo/pages/tickets/time-ago.pipe';
import { NgApexchartsModule } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexPlotOptions,
  ApexChart,
  ApexFill,
  ChartComponent
} from "ng-apexcharts";
import { log } from 'node:console';
import { AdminDashboardTicketComponent } from "./admin-dashboard-ticket/admin-dashboard-ticket.component";
import { AdminDashboardProjectsComponent } from "./admin-dashboard-projects/admin-dashboard-projects.component";
import { AdminDashboardStatisticsComponent } from "./admin-dashboard-statistics/admin-dashboard-statistics.component";
import { AdminDashboardEmployeeComponent } from "./admin-dashboard-employee/admin-dashboard-employee.component";
import { AdminDashboardFeedbackSuggestionComponent } from "./admin-dashboard-feedback-suggestion/admin-dashboard-feedback-suggestion.component";
import { AdminDashboardExpencesComponent } from "./admin-dashboard-expences/admin-dashboard-expences.component";
import { AdminDashboardInvoicesComponent } from "./admin-dashboard-invoices/admin-dashboard-invoices.component";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
};

export type GraphOptions = {
  series: ApexAxisChartSeries;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  chart: ApexChart;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  cseries: ApexAxisChartSeries;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: string[];
};
interface Expense {
  id: string;
  expenseBy: string;
  expenseDate: string;
  amount: number;
  paidBy: string | null;
  status: number;
}

declare const $: any;
@Component({
  selector: 'app-new-admin-dashboard2',
  standalone: true,
  imports: [CommonModule, SharedModule, SlickCarouselModule, CurrencyPipePipe, NgApexchartsModule, AdminDashboardTicketComponent, AdminDashboardProjectsComponent, AdminDashboardStatisticsComponent, AdminDashboardEmployeeComponent, AdminDashboardFeedbackSuggestionComponent, AdminDashboardExpencesComponent, AdminDashboardInvoicesComponent],
  templateUrl: './new-admin-dashboard2.component.html',
  styleUrls: ['./new-admin-dashboard2.component.scss']
})
export class NewAdminDashboard2Component {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public graphOptions: Partial<GraphOptions>;
  public expensesChartOptions: Partial<GraphOptions>;
  public earningsChartOptions: Partial<GraphOptions>;
  getALLStatistical: any;


  getALLFeedbackSuggestion: any;

  getALLTaskStatistics: any;
  getALLgetAllTaskStatistics: any
  completedTask: number;
  totalTask: number;
  getALLAbsent: any;
  date: Date = new Date()
  dateFormat: string = localStorage.getItem('Date_Format');
  getALLJobInquiry: any;
  getAlljobInquiry: any;
  getAllcompanyShift: any;
  getALLInvoice: any;
  totalExpensesAllYears: any;
  totalEarningsAllYears: any;
  currentYearEarnings: any;
  currentYearExpenses: any;
  currentYearProfit: any;
  previousYearStats: any;
  currentYearStats: any;
  getALLTotalData: any;
  public earningsChange: any;
  public expensesChange: any;
  public profitChange: any;

  public barChartLegend = true;
  public barChartPlugins = [];
  pendingLeaves = [];
  approvedLeaves = [];
  getALLProjects: any;
  today: Date = new Date();
  public getUserClient: any;
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
  Projects: any;
  profileData: any;
  pendingCount: number;
  approvedCount: number;

  constructor(private commonservice: CommonService, private sweetlalert: SweetalertService, private router: Router) {
    this.graphOptions = {} 
  }



  ngOnInit(): void {
    this.getAllInvoice()
    this.getProfileData()
    window.scrollTo(0, 0)
    this.getAllStatisticalData()

    this.getAllFeedbackSuggestion()

    this.getAllTaskStatistics()
    this.getAllAbsent()

    this.getAllCompanyShift()

    this.getAllClient()

    this.getChartTotalRevenue()
    this.getAllTotalData()
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
      });
    }, 500);
  }

  getChartTotalRevenue() {
    this.commonservice.get("AdminDashboard/RevenueByYear").subscribe(res => {
      const labels = res?.value?.map(x => x.financialyear);
      const totalExpenses = res?.value?.map(x => x.totalexpense);
      const totalRevenue = res?.value?.map(x => x.totalrevenue);

      this.graphOptions = {
        cseries: [
          {
            name: "Total Expense",
            data: totalExpenses
          },
          {
            name: "Total Revenue",
            data: totalRevenue
          }
        ],
        chart: {
          type: "area",
          height: 250,
          toolbar: {
            show: false
          },
        },
        stroke: {
          curve: "smooth", // Creates wave effect
          width: 3
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: labels
        },
        yaxis: {
          title: {
            text: "Amount"
          }
        },
        grid: {
          borderColor: "#f1f1f1"
        },
        tooltip: { x: { show: false } },
      };
    });
  }


  getAllStatisticalData() {
    this.commonservice.get(`AdminDashboard/StatisticalData`).subscribe((x) => {
      this.getALLStatistical = x.value
      this.calculatePercentageChange();
      if (x && x.statusCode === 200) {
        let data = x.value;

        const currentYearData = data.find((item: any) => item.year === new Date().getFullYear());
        this.Projects = currentYearData || {};

        const years = data.map((item: any) => item.year);
        const earnings = data.map((item: any) => item.totalEarnings || 0);
        const expenses = data.map((item: any) => item.totalExpenses || 0);
        this.currentYearEarnings = currentYearData.totalEarnings;
        this.currentYearExpenses = currentYearData.totalExpenses;
        this.currentYearProfit = currentYearData.totalProfit;

        // Calculate overall totals
        this.totalEarningsAllYears = earnings.reduce((acc, curr) => acc + curr, 0);
        this.totalExpensesAllYears = expenses.reduce((acc, curr) => acc + curr, 0);

        this.loadCharts(years, earnings, expenses);
      }
    });
  }

  loadCharts(years: number[], earnings: number[], expenses: number[]) {
    // Earnings Wave Chart
    this.earningsChartOptions = {
      series: [{ name: "Earnings", data: earnings }],
      chart: { type: 'line', height: 150, sparkline: { enabled: true } },
      stroke: { curve: "smooth", width: 2 },
      xaxis: { categories: years, title: { text: "Year" } }, 
      colors: ["#2ECC71"],
      dataLabels: { enabled: false } 
    };

    // Expenses Bar Chart
    this.expensesChartOptions = {
      series: [{ name: "Expenses", data: expenses }],
      chart: { type: 'bar', height: 150, sparkline: { enabled: true } },
      xaxis: { categories: years, title: { text: "Year" } }, 
      colors: ["#1E40AF", "#FFFFFF"],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          columnWidth: '40%',  // Adjust width for better spacing
          distributed: true,
          borderRadius: 8,  // **Rounded corners**
          borderRadiusApplication: 'end',
        }
      } 
    };
  }
  calculatePercentageChange() {
    const data = this.getALLStatistical;
    const currentYear = new Date().getFullYear(); // 2025
    const previousYear = currentYear - 1; // 2024

    const currentYearData = data.find((item: any) => item.year === currentYear) || {};
    const previousYearData = data.find((item: any) => item.year === previousYear) || {};

    const currentEarnings = currentYearData.totalEarnings || 0;
    const previousEarnings = previousYearData.totalEarnings || 0;

    const currentExpenses = currentYearData.totalExpenses || 0;
    const previousExpenses = previousYearData.totalExpenses || 0;

    const currentProfit = currentYearData.totalProfit || 0;
    const previousProfit = previousYearData.totalProfit || 0;

    // Calculate percentage increase/decrease
    this.earningsChange = this.getLeavewidth(currentEarnings - previousEarnings, previousEarnings);
    this.expensesChange = this.getLeavewidth(currentExpenses - previousExpenses, previousExpenses);
    this.profitChange = this.getLeavewidth(currentProfit - previousProfit, previousProfit);
  }

  getDifference(current: number, previous: number): number {
    return current - previous;
  }

  getDifferenceClass(value: number): string {
    return value >= 0 ? 'text-success' : 'text-danger';
  }



  onClick() {
    this.router.navigate(['/client-list']);
  }
  getLeavewidth(value, totalValue): number {
    if (!totalValue || isNaN(totalValue)) return 0; // Prevent division by zero
    return Math.round((value / totalValue) * 100);
  }
  getAllInvoice() {
    this.commonservice.get(`AdminDashboard/Invoice`).subscribe((x) => {
      this.getALLInvoice = x.value
    })
  }
  getAllTaskStatistics() {
    this.commonservice.get(`AdminDashboard/TaskStatistics`).subscribe((x) => {
      this.getALLgetAllTaskStatistics = x.value;
      this.totalTask = x.value.totalTask;
      this.completedTask = x.value.completedTask;
      this.setChartOptions();
    })
  }

  getAllTotalData() {
    this.commonservice.get(`AdminDashboard/StatisticalDataList`).subscribe((x) => {
      this.getALLTotalData = x.value;
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

  getAllAbsent() {
    this.commonservice.get(`AdminDashboard/Absent`).subscribe({
      next: (response) => {
        if (response && response.value) {
          this.getALLAbsent = response.value;
          this.pendingLeaves = this.getALLAbsent.filter(emp => emp.leaveStatus === 'Pending');
          this.approvedLeaves = this.getALLAbsent.filter(emp => emp.leaveStatus === 'Approved');

          // Count the number of pending and approved leaves
          this.pendingCount = this.pendingLeaves.length;
          this.approvedCount = this.approvedLeaves.length;
        } else {
          this.getALLAbsent = [];
          this.pendingLeaves = [];
          this.approvedLeaves = [];
          this.pendingCount = 0;
          this.approvedCount = 0;
        }
      },
      error: (err) => {
        console.error("Error fetching absent employees:", err);
      }
    });
  }

  setChartOptions() {
    const percentage = this.getLeavewidth(this.completedTask, this.totalTask);

    this.chartOptions = {
      series: [percentage], // Set the series dynamically
      chart: {
        type: "radialBar",
        offsetY: -20
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: "22px"
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        }
      },
      labels: ["Average Results"]
    };
  }


  public getProfileData() {
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.commonservice.get(`person/userdetail`).subscribe(res => {
      this.profileData = res; 
    })
  }
  onClicks() {
    this.router.navigate(['employee-leave-details']);
  } 

  getAllClient() {
    this.commonservice.get('AdminDashboard/Clients').subscribe(res => {
      this.getUserClient = res?.value;
    })
  }

  edituser(id) {
    this.router.navigate(['/client-list/client/' + id])
  }

  async deleteuser(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.commonservice.delete(`Client/${element}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this.getUserClient.data = this.getUserClient.data.filter((item) => item.id !== element.id);
          this.commonservice.showToast('Client deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllClient()
        } else if (res?.statusCode == 400 || !res) {
          this.commonservice.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.commonservice.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.getUserClient.data
    }
  }

  getAllCompanyShift() {
    this.commonservice.get(`AdminDashboard/CompanyShift`).subscribe((x) => {
      this.getAllcompanyShift = x.value
    })
  }


  navigate() {
    this.router.navigate(['employee-leave-details'])
  }
  navProj() {
    this.router.navigate(['project-dashboard'])
  }

  convertPriority(value) {
    const status = ['paid', 'unpaid'];
    let list = status.filter((item, index) => index == value);
    return list;
  }

  leav() {
    this.router.navigate(['employee-leave-details'])
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
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }
}
