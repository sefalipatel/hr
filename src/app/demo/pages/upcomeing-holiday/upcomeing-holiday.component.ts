import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { LoaderComponent } from "../../../loader/loader.component";

@Component({
  selector: 'app-upcomeing-holiday',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './upcomeing-holiday.component.html',
  styleUrls: ['./upcomeing-holiday.component.scss']
})
export class UpcomeingHolidayComponent {
  dateFormat:string = localStorage.getItem('Date_Format');
  todayHoliday:any
  loading: boolean = false
  constructor(private commonservice:CommonService,private router:Router){

  }

  ngOnInit(){
    this.getTodayHoliday()

  }
  getTodayHoliday(){
    this.commonservice.get(`holiday/upcomingHoliday`).subscribe((x)=>{
      this.todayHoliday=x
    })
  }
  getAllHolidayList() {
    this.router.navigate(['holiday-details'])
    }
}
