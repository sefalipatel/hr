// Angular import
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter ,HostListener} from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { NotificationComponent } from '../notification/notification.component';
import { map, share } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { StickyNoteComponent } from './sticky-note/sticky-note.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NotificationComponent,
    StickyNoteComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
    MatTooltipModule
  ],
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  checkOutStatus: { value: number; name: string }[] = [
    { value: 3, name: 'In Meeting' },
    { value: 2, name: 'On Break' },
    { value: 0, name: 'End of Day' }
  ];

  // public props
  @Input() navCollapsed: boolean;
  @Output() NavCollapse = new EventEmitter();
  @Output() NavCollapsedMob = new EventEmitter();
  buttonVisible: boolean = false;
  windowWidth = window.innerWidth;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  timerSubscription: Subscription;
  countdown: number;
  isCheckedIn: boolean = false; 
  LastcheKInOutTime: any;
  TotalWorkingHours: any; // Change done by Ami for work hours timer
  activeStatus: any;
  laststatus: string;
  isCaptured: any;
  timer: any;
  counter: any;
  userId: any;
  Organization: any;
  orgId: string = '';
  stream: MediaStream;
  captureTimeout: any;
  private updateSubscription: Subscription;
  personCamId = JSON.parse(localStorage.getItem('userInfo')).personID;
  personCamCode: any;
  constructor(
    private api: CommonService,
    private _http: HttpClient
  ) {
    setTimeout(() => {
      this.buttonVisible = true;
    }, 3000);
  }

  // To restrict the user from closing the tab or refreshing the page when the status is 1, 2, or 3
  // This is to prevent the user from accidentally losing their check-in/check-out status
  // @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    const LS = localStorage.getItem('LastCheckInOutStatus');
    if (LS === "1" || LS === "2" || LS === "3") {
      $event.preventDefault();
      $event.returnValue = ''; 
    }
  } 

 ngOnInit() {
    this.isCaptured = localStorage.getItem('isCaptured');
    this.counter = localStorage.getItem('counter');

    //DYANMIC TIMER OPTIONS 

    //STATIC TIMER OPTIONS
    this.timer = 60000;

    this.Organizations();
    this.getPersonCode();
    this.getStatusUpdate();

    this.updateSubscription = interval(120000).subscribe(() => {
      this.fetchTimerCountSubscription();
    });
  }

  Organizations() {
    this.orgId = localStorage.getItem('orgId');
    this.userId = JSON.parse(localStorage.getItem('userInfo')).personID;
    this.api.get(`Organizations/${this.orgId}`).subscribe((response) => {
      this.Organization = response.value.isTimer;
      this.isCaptured = response.value.isCaptured; 
    }); 
  }

  getStatusUpdate() {
    this.laststatus = localStorage.getItem('LastCheckInOutStatus');

    if (this.laststatus === '1') {

      if (this.isCaptured) {
        this.captureImage(this.timer);
      }

      this.api.get(`Attendance/minutes`).subscribe((response) => {
        if (response?.statusCode == 200) {
          this.LastcheKInOutTime = true;

          this.timerCountSubscription(); // Always start timer for status 1 and 3
          this.buttonVisible = true; // Always show Check-Out button
        }
      });
    } else if (this.laststatus === '0' || this.laststatus === '2') {
      this.LastcheKInOutTime = false;

      let workingHours = parseInt(localStorage.getItem('TotalWorkingHours'));
      if (workingHours) {
        const totalTime = new Date(workingHours);
        this.TotalWorkingHours = totalTime;
        this.hours = totalTime.getHours();
        this.minutes = totalTime.getMinutes();
        this.seconds = totalTime.getSeconds();
      }

      this.buttonVisible = true; // Show Check-In button
    }

    if (this.laststatus === '3') {
      this.LastcheKInOutTime = false;
      this.api.get(`Attendance/minutes`).subscribe((response) => {
        if (response?.statusCode == 200) {
          this.timerCountSubscription();
          this.buttonVisible = true;
        }
      });
    }
  }

  timerCount(firstDate, SecondDate) {
    // Time Difference in Milliseconds
    const milliDiff: number = firstDate.getTime() - SecondDate.getTime();

    // Converting time into hh:mm:ss format
    // Total number of seconds in the difference
    const totalSeconds = Math.floor(milliDiff / 1000);

    // Total number of minutes in the difference
    const totalMinutes = Math.floor(totalSeconds / 60);

    // Total number of hours in the difference
    const totalHours = Math.floor(totalMinutes / 60);

    // Getting the number of seconds left in one minute
    const remSeconds = totalSeconds % 60;

    // Getting the number of minutes left in one hour
    const remMinutes = totalMinutes % 60;

    return totalHours + ':' + remMinutes + ':' + remSeconds;
  }

  fetchTimerCountSubscription() {
    this.api.get(`Attendance/minutes`).subscribe((response) => {});
  } 
  timerCountSubscription() {
    this.api.get(`Attendance/minutes`).subscribe((response) => {
      if (response?.statusCode == 200) {
        const initialInTime = new Date(new Date().toISOString().slice(0, 10) + ' ' + response?.value?.initialInTime);
        const breakDuration = new Date(new Date().toISOString().slice(0, 10) + ' ' + response?.value?.break_duration);

        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }

        this.timerSubscription = timer(0, 1000)
          .pipe(
            map(() => new Date()),
            share()
          )
          .subscribe((now) => {
            // Only update timer if status is 1 (Available) or 3 (Meeting)
            const currentStatus = localStorage.getItem('LastCheckInOutStatus');
            if (currentStatus === '1' || currentStatus === '3') {
              let totalHoursCalcFirst = this.timerCount(now, initialInTime);
              let firstTimer = new Date(new Date().toISOString().slice(0, 10) + ' ' + totalHoursCalcFirst);

              let totalHoursCalcSecond = this.timerCount(firstTimer, breakDuration);
              let secondTimer = new Date(new Date().toISOString().slice(0, 10) + ' ' + totalHoursCalcSecond);

              this.TotalWorkingHours = secondTimer;
              localStorage.setItem('TotalWorkingHours', secondTimer.getTime().toString());

              this.hours = secondTimer.getHours();
              this.minutes = secondTimer.getMinutes();
              this.seconds = secondTimer.getSeconds();
            }
          });
      }
    });
  }

  captureImage(interval: number) {
    if (this.captureTimeout) {
      clearInterval(this.captureTimeout);
      this.captureTimeout = null;
    }

    const video = document.getElementById('video') as HTMLVideoElement;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const startCamera = async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.stream;
      } catch (err) {
        console.error('Camera error:', err);
      }
    };

    const stopCamera = (stream: MediaStream) => {
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };

    const captureAndSend = async () => {
      const stream = await startCamera();
      if (!this.stream || !ctx) return;

      setTimeout(() => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        this.personCamCode = localStorage.getItem('personCode')?.toUpperCase();
        const payload = {
          Image: imageData,
          PersonCode: this.personCamCode,
          PersonId: this.personCamId
        };
        const headers = new HttpHeaders({
          'Content-Type': 'application/json'
        });
        stopCamera(this.stream);

        this.api.postface(`check-in/`, payload, { headers }).subscribe(
          (res: any) => {
            if (res.message === 'Person is not registered. Register first to start face monitoring!') {
              this.stopCapture();
              return;
            }
            if (res.break_status === true && res.current_status === 2 ) {
              this.stopCapture();
              this.captureImage(10000);
              this.onBreak();
            } else if (res.break_status === true && res.current_status === 1 ) {
              this.stopCapture();
              this.startCountdown();
            }
          },
          (err) => console.error('Error sending image:', err)
        );
      }, 1500);
    };

    // captureAndSend();

    this.captureTimeout = setInterval(captureAndSend, interval);
  }

  getPersonCode() { 
    this.api.get(`Person/${this.personCamId}`).subscribe((response) => {
      const personCode = response.value?.personCode;
      if (response?.statusCode == 200) {
        localStorage.setItem('personCode', personCode);
      }
    });
  }

  startCountdown() {
      if (this.isCaptured) {
        this.captureImage(this.timer);
      }
    this.buttonVisible = false;
    const Status = true;
    let currentDateTime = new Date();
    const activeStatus = 1;
    // Start
    this.api.post(`Attendance/CheckIn/${activeStatus}`, { status: true, CheckInOutDateTime: currentDateTime.toString() }).subscribe(
      (res) => {
        if (res?.statusCode == 200) {
          this.buttonVisible = true;
          setTimeout(() => { 
          }, 3000); 

          localStorage.removeItem('LastCheckInOutStatus');
          this.LastcheKInOutTime = true;
          localStorage.setItem('LastCheckInOutStatus', '1');
          this.api.showToast(res.value.inOutStatus + '. Button will be enable after 3 Seconds!', ToastType.SUCCESS, ToastType.SUCCESS);

          this.timerCountSubscription();

          this.api.attendanceCheckOutStatus(activeStatus);
          const localStatus = localStorage.getItem('LastCheckInOutStatus');
          const video = document.getElementById('video') as HTMLVideoElement;
          const canvas = document.getElementById('canvas') as HTMLCanvasElement;
          const ctx = canvas.getContext('2d');

          const payload = {
            PersonId: this.personCamId
          };

          if (this.isCaptured) {
            
            this.api
              .postface(`updateonbreakstatus/`, payload, {
                //  "PersonId":"85997536-D975-4A31-8B24-08DD82611594"
              })
              .subscribe((res) => {
                // console.log(res);
              });
          }

        
          if (localStatus === '1' && this.isCaptured) {
              this.captureImage(this.timer);
          } 
        }
      },
      (error) => {
        this.buttonVisible = true;
      }
    );
  }

  stop() {
    this.buttonVisible = false;
    const Status = false;
    let currentDateTime = new Date(); // Change done by Ami for work hours timer

    this.api.post(`Attendance/CheckIn/${this.activeStatus}`, { status: false, CheckInOutDateTime: currentDateTime.toString() }).subscribe(
      (res) => {
        if (res?.statusCode == 200) {
          this.buttonVisible = true;
          setTimeout(() => { 
          }, 3000); 

          localStorage.removeItem('LastCheckInOutStatus');
          this.LastcheKInOutTime = false;
          localStorage.setItem('LastCheckInOutStatus', this.activeStatus);
          this.api.showToast(res.value.inOutStatus + '. Button will be enable after 3 Seconds!', ToastType.SUCCESS, ToastType.SUCCESS);

          if (this.activeStatus === 2 || this.activeStatus === 0) {
            if (this.timerSubscription) {
              this.timerSubscription.unsubscribe();
              this.timerSubscription = undefined;
            }
          }

          this.api.attendanceCheckOutStatus(this.activeStatus);
        }
      },
      (error) => {
        this.buttonVisible = true;
      }
    );
  }

  onBreak() {
    this.buttonVisible = false;
    this.activeStatus = 2;
    const Status = false;
    let currentDateTime = new Date(); // Change done by Ami for work hours timer

    this.api.post(`Attendance/CheckIn/${this.activeStatus}`, { status: false, CheckInOutDateTime: currentDateTime.toString() }).subscribe(
      (res) => {
        if (res?.statusCode == 200) {
          this.buttonVisible = true;
          setTimeout(() => { 
          }, 3000); 

          localStorage.removeItem('LastCheckInOutStatus');
          this.LastcheKInOutTime = false;
          localStorage.setItem('LastCheckInOutStatus', this.activeStatus);
          this.api.showToast(res.value.inOutStatus + '. Button will be enable after 3 Seconds!', ToastType.SUCCESS, ToastType.SUCCESS);

          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
            this.timerSubscription = undefined;
          }
          this.api.attendanceCheckOutStatus(this.activeStatus);
        }
      },
      (error) => {
        this.buttonVisible = true;
      }
    );
  } 

  async OncheckOutStatus(data) {
    this.activeStatus = data.value;
    await this.stopCapture();

    // Save current status in localStorage
    localStorage.setItem('LastCheckInOutStatus', this.activeStatus.toString());

    if (this.activeStatus === 0 || this.activeStatus === 2) {
      // Pause timer
      this.stop();
    } else if (this.activeStatus === 3) {
      // Meeting: keep timer running, but show Check-In button
      this.stop(); // Stop current status
      this.timerCountSubscription(); // Resume timer
      this.LastcheKInOutTime = false; // Show Check-In button
    }
  }

  stopCamera() {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
      this.stream = null;
    }
  }

  async stopCapture() {
    if (this.captureTimeout) {
      clearInterval(this.captureTimeout);
      this.captureTimeout = null;
    }
    await this.stopCamera();
  }

  reset() {
    this.stop();
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
  }

  ngOnDestroy() {
    this.stop();
  }

  navCollapse() {
    this.NavCollapse.emit();
  }
}
