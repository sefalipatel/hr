import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { environment } from 'src/environments/environment';
declare const $: any;

@Component({
  selector: 'app-dashboard-poll',
  standalone: true,
  imports: [CommonModule, SharedModule, SlickCarouselModule],
  templateUrl: './dashboard-poll.component.html',
  styleUrls: ['./dashboard-poll.component.scss']
})
export class DashboardPollComponent implements OnInit {
  onList() {
    throw new Error('Method not implemented.');
  }
  public getUserPoll: any;
  pollId: any;
  slideConfig = {
    "slidesToShow": 1, "slidesToScroll": 1, "infinite": true,
    arrows: true,
    dots: false,
    centerMode: false,
    centerPadding: '5%',
    lazyLoad: 'ondemand',
    speed: 250,
    fade: true,
    cssEase: 'linear',
    autoplay: false,

  };
  public attachmentUrl: string = environment.apiUrl.replace('api/', '')
  pollChoiceId: any;
  userId: any
  constructor(private commonSevice: CommonService) { }

  ngOnInit(): void {
    this.getAllUserPoll();
  }

  getAllUserPoll() {
    this.commonSevice.get('Poll/userPoll').subscribe(res => {
      res = res?.sort(function (x, y) {
        return Number(x?.isUserPoll) - Number(y?.isUserPoll);
      }); 
      res = res?.map(x => {
        x['totalCount'] = Math.max(...x?.pollChoices.map(o => o.totalVotes));
        return x;
      }) 
      this.getUserPoll = res;
    })
  }

  userPoll(pollDetail, id) {
    this.pollChoiceId = id;
    if (pollDetail?.isUserPoll)
      return;
    this.userId = JSON.parse(localStorage.getItem('userInfo')).personID;
    let payload = {
      pollChoiceId: id,
      userId: this.userId
    }
    this.commonSevice.post(`Poll/userPoll`, payload).subscribe(res => {
      if (res) {
        this.commonSevice.showToast('Your poll answer saved successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.getAllUserPoll();
      }
    })
  }
  getLeavewidth(value, totalValue): number {
    return Math.round(((+value ?? 0) / (+totalValue ?? 0)) * 100) ?? 0
  }
  generateInitials(pollCreater: string) {
    if (!pollCreater) return '';
    const namePart = pollCreater.split(' ');
    const initail = namePart.map(item => item.charAt(0)).join('');
    return initail.toUpperCase();
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
  transformImagePath(userProfile) {
    return this.attachmentUrl + userProfile.replace('wwwroot\\', '')
  }
}
