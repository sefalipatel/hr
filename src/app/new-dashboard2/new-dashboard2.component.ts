import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardProfileComponent } from '../demo/pages/dashboard-profile/dashboard-profile.component';
import { DashboardAttendanceAndLeaveComponent } from '../demo/pages/dashboard-attendance-and-leave/dashboard-attendance-and-leave.component';
import { TodayOnLeaveComponent } from '../demo/pages/today-on-leave/today-on-leave.component';
import { ChartComponent, } from '../demo/pages/chart/chart.component';
import { Router, RouterModule } from '@angular/router';
import { UpcomeingHolidayComponent } from '../demo/pages/upcomeing-holiday/upcomeing-holiday.component';
import { ResignationFormComponent } from '../demo/pages/resignation-form/resignation-form.component';
import { BirthdayComponent } from '../demo/pages/birthday/birthday.component';
import { CommonService } from '../service/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { TimeAgoPipe } from '../demo/pages/tickets/time-ago.pipe';
import { WorkAnniversaryComponent } from '../demo/pages/work-anniversary/work-anniversary.component';
import { DashboardProjectsComponent } from '../demo/pages/dashboard-projects/dashboard-projects.component';
import { DashboardTicketWidgetComponent } from '../dashboard-ticket-widget/dashboard-ticket-widget.component';
import { DashboardPollComponent } from '../demo/pages/dashboard-poll/dashboard-poll.component';
import { DashboardNotificationComponent } from '../dashboard-notification/dashboard-notification.component';
import { forkJoin } from 'rxjs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardAttendanceTimelineComponent } from '../dashboard-attendance-timeline/dashboard-attendance-timeline.component';
import { DashboardAttendanceViewComponent } from './dashboard-attendance-view/dashboard-attendance-view.component';


@Component({
  selector: 'app-new-dashboard2',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    DashboardProfileComponent,
    ChartComponent,
    DashboardAttendanceAndLeaveComponent,
    DashboardAttendanceTimelineComponent,
    TodayOnLeaveComponent,
    UpcomeingHolidayComponent,
    ResignationFormComponent,
    BirthdayComponent,
    WorkAnniversaryComponent,
    DashboardProjectsComponent,
    DashboardTicketWidgetComponent,
    DashboardPollComponent,
    DashboardNotificationComponent,
    DashboardAttendanceViewComponent,
    TimeAgoPipe, SlickCarouselModule,
    NgApexchartsModule
  ],
  templateUrl: './new-dashboard2.component.html',
  styleUrls: ['./new-dashboard2.component.scss']
})
export class NewDashboard2Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  DashboardBottomTime: any[] = [];
  Birthday: string;
  dateformate: string;
  birthdayFormate: string;
  anniversaryFormate: string;
  todayDateFormat: string;
  public isBirthday: boolean = false;
  public isWorkAnniversary: boolean = false;
  public announcementList: any;
  greeting: string = '';
  goalList: any;
  toDoList: any[] = [];
  public getAllUserWarning: any;
  public getFeedbackData: any[] = [];
  public getsuggestionData: any[] = [];
  public complainRecords: any[] = [];
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format') ;

  public attachmentUrl: string = environment.apiUrl.replace('api/', '');

  //START: ANMATION
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private W: number;
  private H: number;
  totalhors: any;
  date: Date = new Date()
  punchTime = new Date(); // Current time
  private maxConfettis: number = 150;
  private particles: any[] = [];
  private possibleColors: string[] = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];
  TotalWeek: any;
  TotalMonth: any;
  TotalOvertimeMonth: any;
  WeeklyPercentage: string;
  TotalToday: any;
  TodayPercentage: any;
  MonthPercentage: string;
  OvertimePercentage: string;
  user: any;
  profileData: any[] = [];
  //END: ANMATION

  slideConfiguration = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrows: false, // Disable default arrows since we're adding our own
    dots: false,
    centerMode: false,
    centerPadding: '5%',
    lazyLoad: 'ondemand',
    speed: 300,
    autoplaySpeed: 5000,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  };

  suggestions: any[] = [];
  feedbacks: any[] = [];
  activeTab: string = 'suggestion';

  constructor(private datepipe: DatePipe, private commonService: CommonService, public dialog: MatDialog, private router: Router) {

  }

  ngOnInit(): void {
    let data = {
      value: 0
    }
    this.workingHours(data)
    this.updateGreeting();
    this.Birthday = localStorage.getItem('birthDay')
    this.anniversaryFormate = this.datepipe.transform(new Date(localStorage.getItem('anniversary')), 'MM-dd')
    this.birthdayFormate = this.datepipe.transform(new Date(this.Birthday), 'MM-dd')
    this.todayDateFormat = this.datepipe.transform(new Date(), 'MM-dd')
    this.getProfileData();
    this.getAnimation();
    this.getAllAnnouncement();
    this.getAllGoal();
    this.getAllToDoDetails();
    this.getAllWarning();
    this.getUserSuggestion();
  }

  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "infinite": true,
    arrows: false,
    dots: true,
    centerMode: false,
    centerPadding: '5%',
    lazyLoad: 'ondemand',
    speed: 250,
    fade: true,
    cssEase: 'linear',
    autoplay: false, 
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  };

  slideConfig1 = {
    "slidesToShow": 1, "slidesToScroll": 1, "infinite": false,
    arrows: false,
    dots: true,
    centerMode: false,
    centerPadding: '5%',
    lazyLoad: 'ondemand',
    speed: 500,
    fade: true,
    cssEase: 'linear',
    autoplaySpeed: 5000,
    autoplay: false,
    Infinity: true,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  };

  public getProfileData() {
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.commonService.get(`person/userdetail`).subscribe(res => {
      this.profileData = res;

    });
  }

  getAllAnnouncement() {
    this.commonService.get(`Suggestion/Announcement`).subscribe(res => {
      this.announcementList = res;
    })
  }
  workingHours(data) {
    forkJoin([
      this.commonService.get(`attendance/statistics/0`), // Today's Data
      this.commonService.get(`attendance/statistics/1`), // Weekly Data
      this.commonService.get(`attendance/statistics/2`)  // Monthly Data
    ]).subscribe((responses) => {
      this.totalhors = responses ? responses?.values : '';

      if (responses && responses[data.value] && responses[data.value].value) {
        this.totalhors = responses[data.value].value;
        this.totalhors.workDate = new Date(this.totalhors.workDate); 
        const [hours, minutes, seconds] = this.totalhors.punchTime.split(":").map(Number);
        this.totalhors.punchTime = new Date(this.totalhors.workDate);
        this.totalhors.punchTime.setHours(hours, minutes, seconds);
        this.TotalWeek = this.totalhors.workingHour;
        this.TotalMonth = this.totalhors.workingHour;
        this.totalhors.breakTime = responses[data.value].value.breakTime;
        this.totalhors.overtime = responses[data.value].value.overtime;
      }
      if (responses[0]?.value?.workingHour) {
        this.TotalToday = responses[0].value.workingHour;
        this.TodayPercentage = this.calculatePercentage(this.TotalToday, 8 * 3600);
      }
      if (responses[1]?.value?.workingHour) {
        this.TotalWeek = responses[1].value.workingHour;
        this.WeeklyPercentage = this.calculatePercentage(this.TotalWeek, 40 * 3600); // Weekly hours
      }

      if (responses[2]?.value?.workingHour) {
        this.TotalMonth = responses[2].value.workingHour;
        let workingDays = 22;
        this.MonthPercentage = this.calculatePercentage(this.TotalMonth, workingDays * 8 * 3600);
      }

      if (responses[2]?.value?.overtime) {
        this.TotalOvertimeMonth = responses[2].value.overtime;
        let workingDays = 22;
        this.OvertimePercentage = this.calculatePercentage(this.TotalOvertimeMonth, workingDays * 2 * 3600); // Assuming 2 hours extra daily
      }
    });
  }

  calculatePercentage(timeString: string, expectedSeconds: number): string {
    let [h, m, s] = timeString.split(":").map(Number);
    let totalSeconds = h * 3600 + m * 60 + s;
    return ((totalSeconds / expectedSeconds) * 100).toFixed(2);
  }
  convertSecondsToHHMMSS(totalSeconds: number): string {
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
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
  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
  }


  getAllGoal() {
    this.commonService.get(`Goal/GetAllGoalByPersonId`).subscribe(res => {
      this.goalList = res;
    })
  }

  onGoalList() {
    this.router.navigate(['/goal-details'])
  }

  getAllToDoDetails() {
    this.commonService.get(`ToDoList/GetAllToDoListByPersonId`).subscribe((res) => {
      this.toDoList = res.filter(x => {
        return x.isCompleted == false
      })
    })
  }
  onToDoList() {
    this.router.navigate([`/to-do`])
  }

  getAllWarning() {
    this.commonService.get('Warning/GetWarningByEmployee').subscribe(res => {
      this.getAllUserWarning = res?.value;
    })
  }

  getUserSuggestion() {
    this.commonService.get(`Suggestion/GetAllSuggetions`).subscribe(res => {
      this.getFeedbackData = res;

      let createPersons = Array.from(
        new Set(this.getFeedbackData.map(item => item.createPerson))
      ).slice(0, 5);

      this.suggestions = this.getFeedbackData
        .filter(item => item.suggestionType === 0 && createPersons.includes(item.createPerson))
        .slice(0, 5);

      this.feedbacks = this.getFeedbackData
        .filter(item => item.suggestionType === 1 && createPersons.includes(item.createPerson))
        .slice(0, 5);

      this.complainRecords = this.getFeedbackData
        .filter(item => item.suggestionType === 2)
        .slice(0, 5);
    });
  }

  updateGreeting(): void {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 16) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  //birthday and work anniversary animations
  getAnimation() {
    if (this.birthdayFormate == this.todayDateFormat || this.anniversaryFormate == this.todayDateFormat) {
      this.isBirthday = this.birthdayFormate == this.todayDateFormat;
      this.isWorkAnniversary = this.anniversaryFormate == this.todayDateFormat
      this.canvas = this.canvasRef?.nativeElement;
      this.context = this.canvas?.getContext("2d");
      this.W = window.innerWidth;
      this.H = window.innerHeight;
      this.canvas.width = this.W;
      this.canvas.height = this.H;
      this.initializeConfetti();
      this.draw();
      window.addEventListener("resize", this.handleResize.bind(this));

      setTimeout(() => {
        this.isBirthday = false;
        this.isWorkAnniversary = false;
      }, 5000);
    }
  }

  private initializeConfetti() {
    for (let i = 0; i < this.maxConfettis; i++) {
      this.particles.push({ x: Math.random() * this.W, y: Math.random() * this.H - this.H, r: this.randomFromTo(11, 33), d: Math.random() * this.maxConfettis + 11, color: this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)], tilt: Math.floor(Math.random() * 33) - 11, tiltAngleIncremental: Math.random() * 0.07 + 0.05, tiltAngle: 0 });
    }
  }

  private draw() {
    requestAnimationFrame(() => this.draw());
    let remainingFlakes = 0;
    this.context.clearRect(0, 0, this.W, window.innerHeight);
    for (let i = 0; i < this.maxConfettis; i++) {
      let particle = this.particles[i];
      this.context.beginPath();
      this.context.lineWidth = particle.r / 2;
      this.context.strokeStyle = particle.color;
      this.context.moveTo(particle.x + particle.tilt + particle.r / 3, particle.y);
      this.context.lineTo(particle.x + particle.tilt, particle.y + particle.tilt + particle.r / 5);
      this.context.stroke();
      particle.tiltAngle += particle.tiltAngleIncremental;
      particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
      particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;
      if (particle.y <= this.H) remainingFlakes++;
      if (particle.x > this.W + 30 || particle.x < -30 || particle.y > this.H) {
        particle.x = Math.random() * this.W;
        particle.y = -30;
        particle.tilt = Math.floor(Math.random() * 10) - 20;
      }
    }
  }

  private handleResize() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private randomFromTo(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

}
