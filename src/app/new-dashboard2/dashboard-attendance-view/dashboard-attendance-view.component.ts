import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { interval, Subscription } from 'rxjs';
export enum AttendanceStatusEnum {
  Offline = 0,
  Break = 2,
  Available = 1,
  InMeeting = 3
}
export type ChartOptions = {
  series: any[];
  chart: any;
  plotOptions: any;
  labels: string[];
  dataLabels: any;
  colors: string[];
};

@Component({
  selector: 'app-dashboard-attendance-view',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard-attendance-view.component.html',
  styleUrls: ['./dashboard-attendance-view.component.scss']
})
export class DashboardAttendanceViewComponent implements OnInit, AfterViewInit {

  public totalShiftSeconds = 0;
  public progress = 0;
  public interval: any;
  public checkInTime: Date | null = null;
  public checkOut = false;

  public attendanceData: any[] = [];
  public totalElapsedTime: number = 0;
  public isCheckedOut: boolean = false;
  public currentStatus: number | null = 0;
  public checkOutStatus: any;
  public status: any;
  public breakStartTime: any;

  firstCheckIn: Date | null = null;

  private checkOutSubscription!: Subscription;

  @ViewChild('chartRef', { static: false }) chartRef: any;

  public chartOptions: Partial<ChartOptions>;
  private updateSubscription: Subscription;

  constructor(private commonService: CommonService, public dialog: MatDialog, private router: Router) {
    // this.chartOptions = {};
    this.chartOptions = {
      series: [this.progress || 0],
      chart: {
        height: 200,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%",
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: 10,
            },
            value: {
              formatter: () => this.formatTime(),
              show: true,
              fontSize: "16px",
            },
          },
        },
      },
      labels: ["Total Hours"],
      colors: [],
    };

  }

  ngOnInit(): void {
    this.initializeChart();
    this.fetchAttendanceData()
    this.commonService.checkOutStatus$.subscribe(status => {
      this.checkOutStatus = status;
    });

    this.updateSubscription = interval(120000).subscribe(
      (val) => { this.fetchAttendanceDataBackground() });
  }

  ngAfterViewInit() {
    this.checkOutSubscription = this.commonService.checkOutStatus$.subscribe(status => {
      this.checkOutStatus = status;
      this.status = status;

      if (status === AttendanceStatusEnum.Offline) {
        this.isCheckedOut = true;
        // this.progress = 100;
        this.updateChart();
        clearInterval(this.interval);
      } else if (status === AttendanceStatusEnum.Available || AttendanceStatusEnum.InMeeting) {
        this.isCheckedOut = false;
        this.startProgress();
      } else if (status === AttendanceStatusEnum.Break) {
        clearInterval(this.interval);
      }

      this.fetchAttendanceData();
    });
  }

  calculateShiftSeconds(startTime: string, endTime: string): number {
    if (!startTime || !endTime) return 0;

    const [startHours, startMinutes, startSeconds] = startTime.split(":").map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);

    const start = new Date();
    start.setHours(startHours, startMinutes, startSeconds || 0, 0);

    const end = new Date();
    end.setHours(endHours, endMinutes, endSeconds || 0, 0);

    return Math.floor((end.getTime() - start.getTime()) / 1000);
  }

  fetchAttendanceDataBackground() {
    const currentDate = new Date().toISOString().split("T")[0];

    this.commonService.get(`AttendanceDetails/DashboardBottomTimeLine?date=${currentDate}`)
      .subscribe((res) => {
        const totalShiftSeconds = this.calculateShiftSeconds(res[0]?.startTime, res[0]?.endTime);
      });
  } 

  fetchAttendanceData() {
    const currentDate = new Date().toISOString().split("T")[0];

    this.commonService
      .get(`AttendanceDetails/DashboardBottomTimeLine?date=${currentDate}`)
      .subscribe((res) => {
        this.attendanceData = res || [];

        if (
          !res ||
          !this.attendanceData[0]?.checkInOutTime ||
          this.attendanceData[0]?.checkInOutTime.length === 0
        ) {
          this.setDefaultChart();
          return;
        }

        const shift = res[0];
        this.totalShiftSeconds = this.calculateShiftSeconds(
          shift?.startTime,
          shift?.endTime
        );

        const entries = shift.checkInOutTime;
        this.status = entries[entries.length - 1].status;
        this.currentStatus = this.status;
        this.isCheckedOut = false;

        let totalWorkingTime = 0;
        let lastCheckInTime: Date | null = null;

        // ✅ Special case: only 1 check-in
        clearInterval(this.interval);
        if (
          entries.length === 1 &&
          (entries[0].status === AttendanceStatusEnum.Available ||
            entries[0].status === AttendanceStatusEnum.InMeeting)
        ) {
          const checkIn = new Date(entries[0].checkInOutTime);
          const now = new Date();

          totalWorkingTime = Math.floor((now.getTime() - checkIn.getTime()) / 1000);

          this.totalElapsedTime = totalWorkingTime;
          this.checkInTime = checkIn;

          clearInterval(this.interval); // 🧼 Clean previous
          this.startProgress();
          this.isCheckedOut = false;

          setTimeout(() => this.initializeChart(), 500);
          return;
        }

        // ✅ Normal multi-entry logic
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const entryTime = new Date(entry.checkInOutTime);

          if (
            entry.status === AttendanceStatusEnum.Available ||
            entry.status === AttendanceStatusEnum.InMeeting
          ) {
            if (!lastCheckInTime) lastCheckInTime = entryTime;
          }

          if (
            (entry.status === AttendanceStatusEnum.Break ||
              entry.status === AttendanceStatusEnum.Offline) &&
            lastCheckInTime
          ) {
            totalWorkingTime +=
              (entryTime.getTime() - lastCheckInTime.getTime()) / 1000;

            lastCheckInTime = null;
          }
        }

        // If user is still "checked in", count time till now
        if (
          lastCheckInTime &&
          (this.status === AttendanceStatusEnum.Available ||
            this.status === AttendanceStatusEnum.InMeeting)
        ) {
          totalWorkingTime +=
            (new Date().getTime() - lastCheckInTime.getTime()) / 1000;
        }

        this.totalElapsedTime = Math.floor(totalWorkingTime);

        clearInterval(this.interval);
        if (
          this.status === AttendanceStatusEnum.Available ||
          this.status === AttendanceStatusEnum.InMeeting
        ) {
          this.checkInTime = new Date(entries[entries.length - 1].checkInOutTime);
          this.startProgress();
        } else {
          this.isCheckedOut = true;
        }

        setTimeout(() => this.initializeChart(), 500);
      });
  }


  startProgress() {
    if (!this.checkInTime || isNaN(new Date(this.checkInTime).getTime())) {
      return;
    }

    clearInterval(this.interval);

    this.interval = setInterval(() => {
      if (this.isCheckedOut || this.status === AttendanceStatusEnum.Break) {
        clearInterval(this.interval);
        return;
      }
      this.totalElapsedTime += 1;

      this.progress = Math.min(Math.max((this.totalElapsedTime / this.totalShiftSeconds) * 100, 0), 100);
      this.updateChart();
    }, 1000);
  }

  updateChart() {
    if (!this.chartRef || !this.chartRef.updateSeries) {
      console.warn("Chart reference not initialized yet");
      return;
    }

    const progressValue = isNaN(this.progress) ? 0 : Math.max(0, Math.min(this.progress, 100));

    if (this.isCheckedOut) {
      clearInterval(this.interval);
      this.initializeChart();
    } else {
      this.chartRef.updateSeries([progressValue]);
    }
  } 

  initializeChart() {
    const color = "#00C851";

    this.chartOptions = {
      series: [this.progress || 0],
      chart: {
        height: 200,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%",
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: 10,
            },
            value: {
              formatter: () => this.formatTime(),
              show: true,
              fontSize: "16px",
            },
          },
        },
      },
      labels: ["Total Hours"],
      colors: [color],
    };
  }

  formatTime(): string {
    const elapsedSeconds = (this.progress / 100) * this.totalShiftSeconds;
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = Math.floor(elapsedSeconds % 60);

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  ngOnDestroy() {

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.chartRef) {
      try {
        this.chartRef.destroy();
        this.chartRef = null;
      } catch (error) {
        console.warn("Chart destroy error:", error);
      }
    }

    if (this.checkOutSubscription) {
      this.checkOutSubscription.unsubscribe();
    }
  }

  setDefaultChart() {
    this.chartRef?.updateOptions({
      series: [0],
      colors: ["#ccc"],
      title: {
        text: "No Check-In Data",
        align: "center",
        offsetY: 0,
      }
    }, true, false);
  }
}
