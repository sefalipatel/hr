
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ChartConfiguration } from 'chart.js';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonModule, DatePipe, NgFor, NgForOf } from "@angular/common";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardCompanyHRPolicyComponent } from "../../app/demo/pages/dashboard-company-hr-policy/dashboard-company-hr-policy.component";
import { DashboardProjectsComponent } from "../demo/pages/dashboard-projects/dashboard-projects.component";

import { TodayOnLeaveComponent } from "../demo/pages/today-on-leave/today-on-leave.component";
import { UpcomeingHolidayComponent } from "../demo/pages/upcomeing-holiday/upcomeing-holiday.component";
import { WorkAnniversaryComponent } from "../demo/pages/work-anniversary/work-anniversary.component";
import { StatisticsComponent } from "../demo/pages/statistics/statistics.component";
import { ChartComponent } from '../demo/pages/chart/chart.component';

import { DashboardProfileComponent } from '../demo/pages/dashboard-profile/dashboard-profile.component';
import { BirthdayComponent } from '../demo/pages/birthday/birthday.component';
import { DashboardAttendanceAndLeaveComponent } from '../demo/pages/dashboard-attendance-and-leave/dashboard-attendance-and-leave.component';
import { DashboardPollComponent } from '../demo/pages/dashboard-poll/dashboard-poll.component';
import { environment } from 'src/environments/environment';
import { CommonService } from '../service/common/common.service';
import { TimeAgoPipe } from '../demo/pages/tickets/time-ago.pipe';
import { Router, RouterModule } from '@angular/router';
import { ResignationFormComponent } from '../demo/pages/resignation-form/resignation-form.component';
import { MatDialog } from '@angular/material/dialog';
import TitlePopUpComponent from '../demo/pages/title-pop-up/title-pop-up.component';
import { MatTooltipModule } from '@angular/material/tooltip';
declare const $: any;
@Component({
  standalone: true,
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,

  imports: [TimeAgoPipe, MatProgressBarModule, MatIconModule, MatTooltipModule,
    MatTabsModule, CommonModule, SlickCarouselModule, NgFor, NgForOf, TodayOnLeaveComponent,
    UpcomeingHolidayComponent, WorkAnniversaryComponent, StatisticsComponent, DashboardProfileComponent,
    BirthdayComponent, DashboardCompanyHRPolicyComponent, DashboardProjectsComponent, DashboardAttendanceAndLeaveComponent,
    ChartComponent, DashboardPollComponent, RouterModule, ResignationFormComponent]
})
export class NewDashboardComponent {

  public barChartLegend = true;
  public barChartPlugins = [];
  public isBirthday: boolean = false;
  public isWorkAnniversary: boolean = false;
  public attachmentUrl: string = environment.apiUrl.replace('api/', '');
  public announcementList: any;
  public newTicket: any;
  public solvedTicket: any;
  public openTicket: any;
  public pendingTicket: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  joiningDate = localStorage.getItem('anniversary');
  hasPopupShown: boolean = false;
  goalList: any;
  toDoList: any[] = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
  Birthday: string;
  dateformate: string;
  birthdayFormate: string;
  anniversaryFormate: string;
  todayDateFormat: string;


  //START: ANMATION
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private W: number;
  private H: number;
  private maxConfettis: number = 150;
  private particles: any[] = [];
  private possibleColors: string[] = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Gold", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];
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
      // Add other breakpoints as needed
    ]
  };

  constructor(private datepipe: DatePipe, private commonService: CommonService, public dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.Birthday = localStorage.getItem('birthDay')
    this.anniversaryFormate = this.datepipe.transform(new Date(localStorage.getItem('anniversary')), 'MM-dd')
    this.birthdayFormate = this.datepipe.transform(new Date(this.Birthday), 'MM-dd')
    this.todayDateFormat = this.datepipe.transform(new Date(), 'MM-dd')

    const date = new Date()
    this.dateformate = this.datepipe.transform(date, 'YYYY-MM-dd')
    this.getAllAnnouncement();
    this.getAnimation();
    this.getAllGoal();
    this.getAllToDoDetails();
    window.scrollTo(0, 0)

    this.hasPopupShown = localStorage.getItem('popupShown') === 'true';
    if (!this.hasPopupShown) {
      this.commonService.get(`broadcast/broadcast`).subscribe((x) => {
        if (x) {
          const Details = x;
          const dialogRef = this.dialog.open(TitlePopUpComponent, {
            data: { Details },

            width: '800px'
            // height: '400px'
          });
          dialogRef.afterClosed().subscribe((result) => {
            dialogRef.close();
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
    this.hasPopupShown = true;
    localStorage.setItem('popupShown', 'true');
    this.getTicketDetail();
  }

  slideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, "infinite": false,
    arrows: true,
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

  // get announcement data
  getAllAnnouncement() {
    this.commonService.get(`Suggestion/Announcement`).subscribe(res => {
      this.announcementList = res;
    })
  }

  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
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


  //sTART: ANMATION

  private initializeConfetti() {
    for (let i = 0; i < this.maxConfettis; i++) {
      this.particles.push({ x: Math.random() * this.W, y: Math.random() * this.H - this.H, r: this.randomFromTo(11, 33), d: Math.random() * this.maxConfettis + 11, color: this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)], tilt: Math.floor(Math.random() * 33) - 11, tiltAngleIncremental: Math.random() * 0.07 + 0.05, tiltAngle: 0 });
    }
  }

  private randomFromTo(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
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
  //END: ANMATION


  getAnimation() {
    //START: ANMATION
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
  //END: ANMATION

  //Start: Ticket Widget
  getTicketDetail() {
    this.commonService.get(`Ticket/UserTicketList`).subscribe(res => {
      this.newTicket = res?.value?.available
      this.solvedTicket = res?.value?.closed
      this.openTicket = +res?.value?.inProgress + +res?.value?.inReview + +res?.value?.reOpen
      this.pendingTicket = +res?.value?.assigned
    })
  }

  getAllGoal() {
    this.commonService.get(`Goal/GetAllGoalByPersonId`).subscribe(res => {
      this.goalList = res;
    })
  }
  onTicketList() {
    this.router.navigate([`/ticket`])
  }

  //End: Ticket Widget

  // Start: To do
  getAllToDoDetails() {
    this.commonService.get(`ToDoList/GetAllToDoListByPersonId`).subscribe((res) => {
      // this.toDoList = res;
      this.toDoList = res.filter(x => {
        return x.isCompleted == false
      })
    })
  }
  onToDoList() {
    this.router.navigate([`/to-do`])
  }
  // End: To do

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }
  beforeChange(e) {
    console.log('beforeChange');
  }

  onGoalList() {
    this.router.navigate(['/goal-details'])
  }
}
