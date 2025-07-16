import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-work-anniversary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-anniversary.component.html',
  styleUrls: ['./work-anniversary.component.scss']
})
export class WorkAnniversaryComponent {
  getAllDataAnniversary: any
  dateFormat: string = localStorage.getItem('Date_Format');
  attachmentURL: string = environment.apiUrl.replace('api/', '')

  constructor(private commonservice: CommonService) {

  }
  ngOnInit() {
    this.getAllWorkAnniversary();
  }
  getAllWorkAnniversary() {
    this.commonservice.get(`person/workAnniversary`).subscribe((x) => {
      this.getAllDataAnniversary = x
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

  transformImagePath(filePath: string): string {
    return this.attachmentURL + filePath.replace('wwwroot\\', '');
  }
}
