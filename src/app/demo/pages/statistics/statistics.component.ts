import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  WorkingHour: { value: number, name: string }[] = [
    { value: 0, name: "Today" },
    { value: 1, name: "This Week" },
    { value: 2, name: "Last Month" },
  ]
  totalhors: any;

  constructor(private commonservice: CommonService, private router: Router) {

  }

  ngOnInit() {
    let data = {
      value: 0
    }
    this.workingHours(data)
  }

  viewAttendance() {
    this.router.navigate(['attendance'])
  }
  
  workingHours(data) {
    this.commonservice.get(`attendance/statistics/${data.value}`).subscribe((x) => {
      this.totalhors = x ? x?.value : ''
    })
  }

}
