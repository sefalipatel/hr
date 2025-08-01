import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";
import { SharedModule } from 'src/app/theme/shared/shared.module';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip?: any;
};
@Component({
  selector: 'app-admin-dashboard-ticket',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './admin-dashboard-ticket.component.html',
  styleUrls: ['./admin-dashboard-ticket.component.scss']
})
export class AdminDashboardTicketComponent {
  public types = [
    { value: 'thisWeek', viewValue: 'This Week' },
    { value: 'thisMonth', viewValue: 'This Month' }
  ];
  public selectedMonth: string = 'thisWeek';

  public newTicket: number;
  public solvedTicket: number;
  public openTicket: number;
  public pendingTicket: number;
  public totalTickets: number;

  public newTicketPercentage: string;
  public solvedTicketPercentage: string;
  public openTicketPercentage: string;
  public pendingTicketPercentage: string;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private commonService: CommonService, private router: Router) {
    this.initializeEmptyChart();
  }

  ngOnInit(): void {
    this.getTicketDetail();
  }

  onTypeSelected(selectedValue: string) {
    this.selectedMonth = selectedValue;
    this.getTicketDetail();
  }

  getTicketDetail() {
    this.commonService.get(`Ticket/UserTicketListStatistics?&name=${this.selectedMonth}`).subscribe(res => {
      this.newTicket = res?.value?.available;
      this.solvedTicket = res?.value?.closed;
      this.openTicket = (+res?.value?.inProgress) + (+res?.value?.inReview) + (+res?.value?.reOpen);
      this.pendingTicket = (+res?.value?.assigned);
      this.totalTickets = res?.value?.tickets?.length;

      if (this.totalTickets > 0) {
        this.newTicketPercentage = ((this.newTicket / this.totalTickets) * 100).toFixed(2);
        this.solvedTicketPercentage = ((this.solvedTicket / this.totalTickets) * 100).toFixed(2);
        this.openTicketPercentage = ((this.openTicket / this.totalTickets) * 100).toFixed(2);
        this.pendingTicketPercentage = ((this.pendingTicket / this.totalTickets) * 100).toFixed(2);
        this.updateChart();
      } else {
        this.initializeEmptyChart();
      }
    });
  }

  initializeEmptyChart() {
    this.chartOptions = {
      series: [100],
      chart: {
        type: "donut",
        width: 380
      },
      labels: ["No Data"],
      colors: ["#E5E7EB"],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      }
    };
  }

  updateChart() {
    this.chartOptions = {
      series: [this.newTicket, this.solvedTicket, this.openTicket, this.pendingTicket],
      chart: {
        type: "donut",
        width: 380
      },
      labels: ["New Ticket", "Solved Ticket", "Open Ticket", "Pending Ticket"],
      colors: ["#1E3A8A", "#3B82F6", "#60A5FA", "#93C5FD"],
      dataLabels: {
        enabled: true,
        formatter: (val: any) => val.toFixed(1) + "%"
      },
      tooltip: {
        y: {
          formatter: (val: any) => val + " tickets"
        }
      },
      legend: {
        show: false // This will remove the side label
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  onTicketList() {
    this.router.navigate([`/ticket`]);
  }
}