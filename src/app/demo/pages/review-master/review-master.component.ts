import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SharedModule } from 'primeng/api';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


export enum Review {
  Self = 0,
  Peer = 1,
  Management = 2
}
@Component({
  selector: 'app-review-master',
  standalone: true,
  imports: [CommonModule, SharedModule, MatPaginatorModule,MatProgressSpinnerModule, MatTableModule, MatTooltipModule, RouterModule],
  templateUrl: './review-master.component.html',
  styleUrls: ['./review-master.component.scss']
})
export class ReviewMasterComponent {
  public displayedColumns: string[] = [];
  public reviewId : any;
  dateFormat:string = localStorage.getItem('Date_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  review: any;
  loading : boolean = false
  dataSource = new MatTableDataSource<any>();

  constructor(private router: Router, private api: CommonService) {
    this.displayedColumns = ['title', 'reviewDate','dueDate', 'reviewType', 'department', 'action'];
  }

  ngOnInit() {
    this.getAllReview();
  }

  viewReview(value) {
    this.router.navigate(['/employee-review-master-details/admin-review-master-questions/' + value.id]);
  }


  getAllReview() {
    this.loading = true
    this.api.get(`Review`).subscribe(res => {
      this.loading = false
      this.review = res;     
      this.dataSource = new MatTableDataSource<any>(this.review);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  getReviewTypeName(type: number): string {
    return Review[type];
  }

  applybtn(id){
    this.api.post(`UserReviewDetail/ApplyReview?ReviewId=${id}`,'').subscribe(res => {
      if(res?.statusCode == 200){
        this.api.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }
    })
  }
}
