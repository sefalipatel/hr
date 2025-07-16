import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions } from 'chart.js';
import { CommonService } from 'src/app/service/common/common.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard-company-shift',
  standalone: true,
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './admin-dashboard-company-shift.component.html',
  styleUrls: ['./admin-dashboard-company-shift.component.scss']
})
export class AdminDashboardCompanyShiftComponent {
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels = [ [ 'No. of Genral shift employee' ], [ 'No. of Night shift employee' ], 'No. of Second shift employee' ];
  public pieChartDatasets = [ {
    data: [ 150, 50, 100 ],
    backgroundColor: [
      'rgb(153, 204, 255)',
      'rgb(255, 255, 153)',
      'rgb(255, 153, 204)'
    ],
    borderWidth:0,
    hoverOffset: 4,
    hoverBorderColor:'rgb(0, 204, 0)',
  } ];
  public pieChartLegend = false;
  public pieChartPlugins = [];
  public getUserShift: any;
  

constructor(private commonservice: CommonService) {
}

ngOnInit(): void {
  this.getAllCompanyShift();
}

getAllCompanyShift() {
  this.commonservice.get('AdminDashboard/CompanyShift').subscribe(res => {
    this.getUserShift = res?.value;
  })
}
}
