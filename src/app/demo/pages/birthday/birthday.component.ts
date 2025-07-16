import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { CommonService } from 'src/app/service/common/common.service';
import { Router, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-birthday',
  standalone: true,
  imports: [CommonModule,SharedModule, MaterialModule, RouterModule],
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit{

  birthDayList: any[] = [];
  imageUrl: string = environment.apiUrl.replace('api/', '');
  dateFormat: string = localStorage.getItem('Date_Format');
  personCount: number = 0;
  
  constructor(
    private _commonService: CommonService,
  ) {}
  
  ngOnInit(): void {
    this.getBirthDayList();
  }

  getBirthDayList() {
    this._commonService.get(`person/birthday`).subscribe(res => {
      this.birthDayList = res;
      this.personCount = this.birthDayList.length;
    })
  }

  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
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
}
