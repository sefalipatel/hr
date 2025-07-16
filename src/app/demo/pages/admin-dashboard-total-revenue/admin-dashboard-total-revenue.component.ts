import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonService } from 'src/app/service/common/common.service';
import { CurrencyPipePipe } from '../../../../app/pipe/currency-pipe.pipe';
@Component({
  selector: 'app-admin-dashboard-total-revenue',
  standalone: true,
  imports: [CommonModule,CurrencyPipePipe,BaseChartDirective],
  templateUrl: './admin-dashboard-total-revenue.component.html',
  styleUrls: ['./admin-dashboard-total-revenue.component.scss']
})
export class AdminDashboardTotalRevenueComponent {
  public barChartLegend = true;
  public barChartPlugins = [];
  public viewChart:boolean=false;

public barChartData: ChartConfiguration<'bar'>['data'] = {
  labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
  datasets: [
    { data: [ 65, 59, 80, 81, 56, 55, 40 ],
       label: 'totalexpense',
       backgroundColor: [
        'rgba(54, 166, 150, 0.2)'
      ],
       },
    { data: [ 28, 48, 40, 19, 86, 27, 90 ],
       label: 'totalrevenue',
       backgroundColor: [
        'rgba(54, 162, 235, 0.8)'
      ],
      
      }
  ]
};

public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  responsive: true,
};

constructor(private _commonService: CommonService ) {
}

ngOnInit(){
  this.getChartTotalRevenue();
}

getChartTotalRevenue() {
  this.barChartData.datasets[0].data = [];
  this.barChartData.datasets[1].data = [];
  this.barChartData.labels = [];
  this._commonService.get('AdminDashboard/RevenueByYear').subscribe(res => {
    res?.value?.map(x=>{
      this.barChartData.labels.push(x.financialyear)
      this.barChartData.datasets[0].data.push(x.totalexpense)
      this.barChartData.datasets[1].data.push(x.totalrevenue)
      this.viewChart=true;
    })
  })
}
}
