import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../theme/shared/shared.module';
import { CommonService } from '../service/common/common.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexAnnotations,
  ApexNoData,
  ApexStates
} from "ng-apexcharts";
import { NgApexchartsModule } from "ng-apexcharts";

export type ChartOptions = {
  annotations: ApexAnnotations
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
  noData: ApexNoData;
  states: ApexStates;
  colors: string[];
};

@Component({
  selector: 'app-dashboard-attendance-timeline',
  standalone: true,
  imports: [CommonModule, SharedModule, NgApexchartsModule],
  templateUrl: './dashboard-attendance-timeline.component.html',
  styleUrls: ['./dashboard-attendance-timeline.component.scss']
})

export class DashboardAttendanceTimelineComponent implements OnInit {

  public chartOptions: Partial<ChartOptions>;

  constructor(private commonService: CommonService) {
    this.chartOptions = {}
  }

  timelineSegments: { color: string; label: string; time: string; duration: number }[] = [];
  shiftStart: number = 0;
  shiftEnd: number = 0;
  checkInOutTimes: { time: number; status: number }[] = [];
  currentTime: number = this.convertToHours(new Date().toISOString());

  ngOnInit(): void {
    this.fetchShiftData();
    setInterval(() => {
      this.currentTime = this.convertToHours(new Date().toISOString());
      this.updateChart();
    }, 60000); // Update every minute
  }

  fetchShiftData() {
    const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    this.commonService.get(`AttendanceDetails/DashboardBottomTimeLine?date=${currentDate}`)
      .subscribe((response) => {
        if (response.length > 0) {
          const shift = response[0];
          this.shiftStart = this.convertToShiftHours(shift.startTime);
          this.shiftEnd = this.convertToShiftHours(shift.endTime);
          this.checkInOutTimes = shift.checkInOutTime.map((entry) => ({
            time: this.convertToHours(new Date(entry.checkInOutTime).toISOString()),
            status: entry.status
          }));
          const chartDate = this.updateChart();
          this.initializeChart(response, chartDate);
        }
        else {
          this.initializeChart([], []);
        }
      });
  }

  updateChart() {
    const segments = [];
    let lastTime = null;
    let lastStatus = null;
    const current = this.currentTime; // Real-time updates
    let segmentStart = null;
    let segmentColor = null;
    let isEarlyCheckIn = false;
    let isCheckIn = false;

    segments.push({ x: 'Work Hours', y: [this.shiftStart, this.shiftEnd], fillColor: '#D3D3D3' });

    for (let i = 0; i < this.checkInOutTimes.length; i++) {
      const { time, status } = this.checkInOutTimes[i];

      if (lastTime === null) {
        // **First Check-in Handling**
        if (status === 1) {
          if (time < this.shiftStart) {
            // **Early Check-in (Blue)**
            segmentStart = time;
            segmentColor = '#0000FF';
            isEarlyCheckIn = true;
            if (isEarlyCheckIn && current >= this.shiftStart) {
              segments.push({ x: 'Work Hours', y: [segmentStart, this.shiftStart], fillColor: '#0000FF' });
              segmentStart = this.shiftStart;
              segmentColor = '#00C851'; // Start Green at Shift Start
              isEarlyCheckIn = false;
            }
          } else if (time > this.shiftStart) {
            // **Late Check-in (Red)**
            segments.push({ x: 'Work Hours', y: [this.shiftStart, time], fillColor: '#FF0000' });
            segmentStart = time;
            segmentColor = '#00C851'; // Start Green Work Bar
          } else {
            // **On-Time Check-in (Green)**
            segmentStart = time;
            segmentColor = '#00C851';
          }
        }
      } else { 

        // **Break Handling**
        if (lastStatus === 1 && status === 2) {
          segments.push({ x: 'Work Hours', y: [segmentStart, time], fillColor: segmentColor }); // Stop work at break start
          segmentStart = time;
          segmentColor = '#FFA500'; // **Orange (Break)**
        }

        // **Work Resuming from Break**
        if (lastStatus === 2 && status === 1 && !isCheckIn) {
          segments.push({ x: 'Work Hours', y: [segmentStart, time], fillColor: '#FFA500' }); // Stop break
          segmentStart = time;
          segmentColor = '#00C851';
          if (current >= this.shiftEnd) {
            segments.push({ x: 'Work Hours', y: [segmentStart, this.shiftEnd], fillColor: '#00C851' });
            segmentStart = this.shiftEnd;
            segmentColor = '#FF4D00';
            isCheckIn = true;
          }
        }
      }


      lastTime = time;
      lastStatus = status;
    }

    // **Dynamically Extend the Last Segment**
    if (segmentStart !== null) {
      segments.push({ x: 'Work Hours', y: [segmentStart, current], fillColor: segmentColor });
    }

    if (lastStatus === 0) {
      // **Terminate the bar when status is 0**
      if (segmentStart !== null) {
        segments.push({ x: 'Work Hours', y: [segmentStart, lastTime], fillColor: segmentColor });
      } // Stop further processing
      return segments;
    }
    return segments;
  }

  convertToHours(timestamp: string): number {
    // Remove any trailing dots or unexpected characters
    const cleanedTimestamp = timestamp.trim().replace(/\.$/, "");

    // Parse the date correctly
    const dateObj = new Date(cleanedTimestamp.replace(" ", "T")); // Convert to valid ISO format

    if (isNaN(dateObj.getTime())) {
      console.error("Invalid Date format:", timestamp);
      return NaN;
    }

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    return hours + minutes / 60;
  }

  initializeChart(response: any[], chartData: any[]) {
    if (!response.length || !chartData.length) {
      // Show an empty chart with styling but without the rangeBar
      this.chartOptions = {
        series: [],
        chart: {
          type: "rangeBar",
          height: 100,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "50%",
            distributed: true,
            borderRadius: 6
          }
        },
        xaxis: {
          type: "numeric",
          min: 0,
          max: 10, // Default empty range
          tickAmount: 10,
          labels: {
            style: { fontSize: "10px" }
          },
          axisBorder: { show: false }
        },
        yaxis: {
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        grid: {
          show: false,
          borderColor: "transparent"
        },
        stroke: {
          show: false
        },
        tooltip: {
          enabled: false
        },
        fill: {
          opacity: 1
        },
        noData: {
          text: "No data available",
          align: "center",
          verticalAlign: "middle",
          style: {
            color: "#888",
            fontSize: "14px"
          }
        }
      };
      return;
    }

    // Extract minStartTime and maxEndTime for valid data
    const shift = response[0];
    const minStartHour = this.convertToShiftHours(shift.minStartTime) - 1;
    const maxEndHour = this.convertToShiftHours(shift.maxEndTime) + 1;
    const startHour = this.convertToShiftHours(shift.startTime);
    const endHour = this.convertToShiftHours(shift.endTime);

    this.chartOptions = {
      series: [{
        name: "Work Schedule",
        data: chartData
      }],
      chart: {
        type: "rangeBar",
        height: 100,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%",
          distributed: true,
          borderRadius: 6
        }
      },
      xaxis: {
        type: "numeric",
        min: minStartHour,
        max: maxEndHour,
        tickAmount: maxEndHour - minStartHour,
        labels: {
          formatter: (val: any) => this.formatTimeLabel(val),
          style: { fontSize: "10px" }
        },
        axisBorder: { show: false }
      },
      yaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: false,
        borderColor: "transparent"
      },
      stroke: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      states: {
        normal: {
          filter: {
            type: "none" // Prevents color change on default state
          }
        },
        hover: {
          filter: {
            type: "none" // Prevents color change on hover
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none" // Prevents color change on selection
          }
        }
      }
    };
  }

  convertToShiftHours(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  }

  formatTimeLabel(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }

}
