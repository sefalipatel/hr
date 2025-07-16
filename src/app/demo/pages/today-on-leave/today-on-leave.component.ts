import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

export enum leaveStatus {
  FirstHalf = 0,
  SecondHalf = 1,
  FullDay = 2
}

@Component({
  selector: 'app-today-on-leave',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './today-on-leave.component.html',
  styleUrls: ['./today-on-leave.component.scss']
})
export class TodayOnLeaveComponent {
  leaveStatus = leaveStatus;
  getALLDataLave:any
  attachmentURL: string = environment.apiUrl.replace('api/', '')
  constructor(private commonservice: CommonService) {

  }

  ngOnInit() {
    this.getAllToDayOnLeave()
  }
  getAllToDayOnLeave() {
    this.commonservice.get(`attendance/todayonleave`).subscribe((x) => {
      this.getALLDataLave = x
    })
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

}
