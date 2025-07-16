import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export enum WorkingHour {
  ThisWeek = 0,
  ThisMonth = 1
}
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatTabsModule, SlickCarouselModule, MatFormFieldModule, SharedModule,
    ReactiveFormsModule, MatSelectModule, NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  public barChartLegend = true;
  public barChartPlugins = [];
  public workingHour = [
    { name: 'This Week', id: 0 },
    { name: 'This Month', id: 1 },
  ];
  selectedMonth: number;
  public getUserHourAttendanceData: any;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [6, 8, 7, 5, 6, 7, 6],
        label: 'Working',
        borderRadius: 50,
        borderWidth: 1,
        barThickness: 9,
      },
      {
        data: [1, 23, 34, 25, 32, 12, 17],
        label: 'Break',
        borderRadius: 50,
        borderWidth: 1,
        barThickness: 9,
      }
    ]
  };
  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };
  barChartLabels: unknown[] | undefined;

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("chart") char: ChartComponent;
    public chartOption: Partial<ChartOptions>;

  constructor(private _commonService: CommonService) { 
    this.chartOptions = { };
    this.chartOption ={ }
  }
  

  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = 0;
    this.getChartLocation();
  }

  getChartLocation() {
    this._commonService.get(`Attendance/userHours/${this.selectedMonth}`).subscribe(res => {
      let categories: string[] = [];
      let workingHoursData: number[] = [];
      let breakData: number[] = [];
  
      const today = new Date();
  
      if (this.selectedMonth === WorkingHour.ThisWeek) {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        categories = [];
        workingHoursData = [];
        breakData = [];
  
        days.forEach(day => {
          categories.push(day);
          workingHoursData.push(this.formatDecimal(res[1]?.[day.toLocaleLowerCase()]));
          breakData.push(this.formatDecimal(res[0]?.[day.toLocaleLowerCase()]));
        });
      } else {
        categories = this.generateWeeksForMonth(today.getFullYear(), today.getMonth() + 1);
  
        workingHoursData = categories.map((_, index) => this.formatDecimal(res[1]?.[`week${index + 1}`]));
        breakData = categories.map((_, index) => this.formatDecimal(res[0]?.[`week${index + 1}`]));
      }
  
      this.chartOptions = {
        series: [
          { name: "Working Hours", data: workingHoursData },
          { name: "Break Hours", data: breakData }
        ],
        chart: {
          height: 250,
          type: "area",
          toolbar: { show: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        xaxis: { categories },
        yaxis: {
          labels: {
            formatter: (value: any) => value.toFixed(2)
          }
        },
        tooltip: { 
          y: { 
            formatter: (value: any) => value.toFixed(2) 
          }
        }
      };
    });
  }
  
  /** Utility function to format decimal values */
  formatDecimal(value: any): number {
    return value === null || value === undefined ? 0.0 : parseFloat(value.toFixed(2));
  }
  

  generateWeeksForMonth(year: number, month: number): string[] {
    const weeks: string[] = [];
    let startDate = new Date(year, month - 1, 1); // Month is 0-based in JS
    const monthName = startDate.toLocaleString('default', { month: 'long' });
  
    let weekCount = 1;
    while (startDate.getMonth() === month - 1) {
      let endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
  
      if (endDate.getMonth() !== month - 1) {
        endDate = new Date(year, month, 0); // Last day of the month
      }
  
      weeks.push(`${this.ordinalSuffix(weekCount)} Week (${startDate.getDate()}-${endDate.getDate()})`);
      startDate.setDate(startDate.getDate() + 7);
      weekCount++;
    }
    return weeks;
  }
  
  ordinalSuffix(i: number): string {
    if (i % 10 === 1 && i % 100 !== 11) return i + "st";
    if (i % 10 === 2 && i % 100 !== 12) return i + "nd";
    if (i % 10 === 3 && i % 100 !== 13) return i + "rd";
    return i + "th";
  }

  onWorkingHourChange(selectedHour: WorkingHour): void {
    this.selectedMonth = selectedHour;
    this.getChartLocation();
  }

  onTypeSelected(e) {
    this.getChartLocation();
  }

  public generateData(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.random() * (yrange.max - yrange.min + 1) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}

export { ApexChart };
