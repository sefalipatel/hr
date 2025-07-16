import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonService } from 'src/app/service/common/common.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-profile',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatIconModule, MatTabsModule, SlickCarouselModule, RouterModule],
  templateUrl: './dashboard-profile.component.html',
  styleUrls: ['./dashboard-profile.component.scss']
})
export class DashboardProfileComponent implements OnInit {

  profileData: any[] = [];
  imageUrl: string = environment.apiUrl.replace('api/', '');
  profilePicture: string = '';
  dateFormat: string = localStorage.getItem('Date_Format');

  constructor(
    private _commonService: CommonService, private router: Router
  ) { }

  ngOnInit(): void {
    this.getProfileData();
    localStorage.setItem('userProfilePicture', this.profilePicture)
  }

  public getProfileData() {
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this._commonService.get(`person/userdetail`).subscribe(res => {
      this.profileData = res;
      res.map(x => {
        let logo = x?.profilePicture ? this.imageUrl + x?.profilePicture.replace('wwwroot\\', '') : '';
        this.profilePicture = logo; 
        this._commonService.setProfilePicture(this.profilePicture)
      })
    })
  }
}
