import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit{

  public organizationId: string = '';
  packageDetail: any[] = [];
  dateFormat:string = localStorage.getItem('Date_Format');
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['packageName', 'packageDuration', 'price', 'paymentDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private _commonService: CommonService, private datePipe: DatePipe) {
  
  }
  
  ngOnInit(): void {
    this.getAllPackageList();
  }

  getAllPackageList() {
    this._commonService.get(`Package/PaymentHistory`).subscribe(res => {
      this.packageDetail = res;
      this.organizationId = res[0]?.organizationId;
      this.dataSource = new MatTableDataSource<any>(this.packageDetail);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  cancel() {
    this.router.navigate([`/organization-details/org-subscription/${this.organizationId}`]);
  }
}
