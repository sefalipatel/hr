import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}
@Component({
  selector: 'app-profile-information',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit {

  personId: string;
  uploadedlogo: string | null = null;
  dateFormat: string = localStorage.getItem('Date_Format');
  @Output() userId: EventEmitter<string> = new EventEmitter();
  userData: any[] = [];

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile: boolean = false;

  constructor(private router: Router, private _commonService: CommonService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.personId = params['id'];
    });
    this.getUserData();
  }

  getUserData() {
    this.personId = this.personId ?? JSON.parse(localStorage.getItem('userInfo')).personID;
    if (this.personId) {
      // Person/list?employeeId=
      this._commonService.get(`Person/list?employeeId=${this.personId}`).subscribe((response) => {
        this.userData = response;
        response.map(res => {
          let logo = res?.profilePicture && res?.profilePicture?.includes('.') ? `${environment.apiUrl.replace('api/', '')}` + res?.profilePicture.replace('wwwroot\\', '') : '';
          this.uploadedlogo = logo;
        })
      })
    }
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
  editUserDetail(id) {
    this.userId.emit(id);
  }

  getGender(gender?: any): any {
    if (gender) {
      switch (gender) {
        case Gender.Male:
          return 'Male';
        case Gender.Female:
          return 'Female';
        case Gender.Other:
          return 'Other';

        default:
          return '';
      }
    }
  }
}
