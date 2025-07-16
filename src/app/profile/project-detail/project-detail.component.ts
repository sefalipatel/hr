import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';

export enum Priority {
  High = 0,
  Medium = 1,
  Low = 2,
}
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  personId: string = '';
  imageUrl: string = environment.apiUrl.replace('api/', '');
  projectDetails: any[] = [];
  public projectLeaderDetail: any;
  dateFormat: string = localStorage.getItem('Date_Format');

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;

    if (profile) {
      this._commonService.get(`ProjectMembers/projectlist?personId=${this.personId}`).subscribe(res => {
        res.map(response => {
          let projectLeader;
          response.projectMember.forEach(pm => {
            projectLeader = !projectLeader ? pm : projectLeader?.designationLevel > pm.designationLevel ? pm : projectLeader
          });
          response['projectLeader'] = projectLeader;
          return response;

        })
        this.projectDetails = res;
      })
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile: boolean = false;

  constructor(
    private _commonService: CommonService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.personId = params['id'];

      if (this.personId) {
        this.getAllAssignProjectuserData();
      }
    });
  }

  getAllAssignProjectuserData() {
    this._commonService.get(`ProjectMembers/projectlist?personId=${this.personId}`).subscribe((res) => {
      res.map(response => {
        let projectLeader;
        response.projectMember.forEach(pm => {
          projectLeader = !projectLeader ? pm : projectLeader?.designationLevel > pm.designationLevel ? pm : projectLeader
        });
        response['projectLeader'] = projectLeader;
        return response;
      })
      this.projectDetails = res;
    })
  }

  transformImage(image: string): string {
    return image ? this.imageUrl + image.replace('wwwroot\\', '') : '';
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

  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
  }

  convertStatus(value) {
    const status = ['', 'In Progress', 'Completed', 'On Hold', 'Backlog'];
    let list = status.filter((item, index) => index == value);
    return list;
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
}
