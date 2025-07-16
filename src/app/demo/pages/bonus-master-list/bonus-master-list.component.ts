import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/theme/shared/shared.module';

export enum calculationType {
  FlatAmount = 1,
  PercentageofCTC = 0,

}

export const calculationTypeLable = {
  [calculationType.FlatAmount]: 'Flat Amount',
  [calculationType.PercentageofCTC]: 'Percentage of CTC',
};
@Component({
  selector: 'app-bonus-master-list',
  standalone: true,
  imports: [CommonModule, SharedModule,MatProgressSpinnerModule, MatPaginatorModule, MatTableModule, RouterModule],
  templateUrl: './bonus-master-list.component.html',
  styleUrls: ['./bonus-master-list.component.scss']
})
export class BonusMasterListComponent {
  isdisbaled=false
  public displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  public sortConfig!: Sort
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public bonusUserId = '';
  loading :  Boolean = false;
  @Output() bonusId = new EventEmitter<string>();
  constructor(private router: Router, private api: CommonService) {
    this.displayedColumns = ['title', 'employeeName', 'personCode', 'calculationType', 'remark', 'amount', 'status', 'action'];

  }
  AddBonus() {
    this.router.navigate(['bonus-master-list/addBonus'])
  }
  viewReview(element) {
    this.isdisbaled=true
    this.router.navigate(['/employee-bonus-details/' + element.id]);
    this.bonusUserId = element.id;
    this.bonusId.emit(element.id);
  }
  edituser(element){  
    this.router.navigate(['/bonus-master-list/addBonus/' + element]);
  }
  ngOnInit() {
    this.loading = true 
    this.api.get('Bonus/GetAllBonus').subscribe((x) => {
      this.loading = false
      this.dataSource.data = x

    })
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getStatusLabel(status: number): string {
    return calculationTypeLable[status] || 'Unknown';
  }
}
