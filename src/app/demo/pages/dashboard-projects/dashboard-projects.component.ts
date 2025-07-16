import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { environment } from 'src/environments/environment';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export enum Priority {
  High = 0,
  Medium = 1,
  Low = 2,
}

@Component({
  selector: 'app-dashboard-projects',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, MatMenuModule, MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.scss']
})


export class DashboardProjectsComponent {
  getALLDataLave: any;
  cardData: any
  dateFormat: string = localStorage.getItem('Date_Format');
  imageUrl: string = environment.apiUrl.replace('api/', '');

  slideConfiguration = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrows: false, // Disable default arrows since we're adding our own
    dots: false,
    centerMode: false,
    centerPadding: '5%',
    lazyLoad: 'ondemand',
    cssEase: 'linear',
    speed: 10000,
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

  constructor(private commonservice: CommonService, private router: Router) {
  }

  ngOnInit() {
    this.getAllUserproject()
  }


  getAllUserproject() {
    const personId = JSON.parse(localStorage.getItem('userInfo')).personID;
    this.commonservice.get(`ProjectMembers/projectlist?personId=${personId}`).subscribe((res) => {
      res.map(response => {
        let projectLeader;
        response.projectMember.forEach(pm => {
          projectLeader = !projectLeader ? pm : projectLeader?.designationLevel > pm.designationLevel ? pm : projectLeader
        });
        response['projectLeader'] = projectLeader;
        return response;
      })
      this.cardData = res
    })
  }
  getPriority(priority?: Priority): string {
    switch (priority) {
      case Priority.High:
        return 'High';
      case Priority.Medium:
        return 'Medium';
      case Priority.Low:
        return 'Low';
      default:
        return '';
    }
  }
  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
  onList() {
    this.router.navigate(['/project-dashboard'])
  }
  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
  }

  stringToColor(string: any) {
    let hash = 0;
    let i;
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return string?.length ? color : '#bfbfbf';
  }

  slides = [
    { img: "http://placehold.it/350x150/000000" },
    { img: "http://placehold.it/350x150/111111" },
    { img: "http://placehold.it/350x150/333333" },
    { img: "http://placehold.it/350x150/666666" }
  ];
  slideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, "infinite": false,
    arrows: true,
    dots: true,
    centerMode: false,
    centerPadding: '5%',
    lazyLoad: 'ondemand',
    speed: 300,
    autoplaySpeed: 5000,
    autoplay: false,
    adaptiveHeight: true,
   
  };


  addSlide() {
    this.slides.push({ img: "http://placehold.it/350x150/777777" })
  }

  removeSlide(model) {
    this.slides.length = this.slides.length - 1;
  }

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

  ProjectTask(id) {
    this.router.navigate(['project-dashboard/project-task/' + id])
  }

  ProjectBoard(id) {
    this.router.navigate(['project-dashboard/project-taskboard/' + id])
  }
  convertStatus(value) {
    const status = ['', 'In Progress', 'Completed', 'On Hold', 'Backlog'];
    let list = status.filter((item, index) => index == value);
    return list;
  }

  getRemainingMembersCount(members: any[]): number {
    return members.length > 5 ? members.length - 5 : 0;
  }

}
