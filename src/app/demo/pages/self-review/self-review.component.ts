import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from 'src/app/theme/shared/material.module';

export interface SelfReview {
  ReviewTitle: string;
  reviewDate: string;
  view: string
}
export enum ReviewType {
  Self = 0,
  Peer = 1,
  Management = 2
}
@Component({
  selector: 'app-self-review',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatProgressSpinnerModule,MaterialModule ,MatPaginatorModule, SharedModule, MatSortModule, RouterModule, MatSelectModule, MatTooltipModule],
  templateUrl: './self-review.component.html',
  styleUrls: ['./self-review.component.scss']
})
export class SelfReviewComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<SelfReview>();
  public displayedColumns: string[] = [];
  selectedReviewType: string | null = null;
  selectedRole: string | null = null;
  public tableData = [];
  dateFormat:string = localStorage.getItem('Date_Format');
  allUserReview: any;
  loading : boolean = false;
  reviewTypeList = [
    { name: ReviewType.Self, id: 0 },
    { name: ReviewType.Peer, id: 1 },
    { name: ReviewType.Management, id: 2 },
  ]

  constructor(private router: Router,
    private api: CommonService) {
    this.displayedColumns = ['title', 'reviewDate', 'dueDate', 'reviewType', 'department','action'];
  }

  ngOnInit() {
    this.getAllUserReview();
  }

  getReviewTypeName(type: number): string {
    return ReviewType[type];
  }

  getAllUserReview(id: any = 0) {
    this.loading = true
    this.api.get(`UserReviewDetail/UserReviewByPersonId`).subscribe(res => {
      this.loading = false
      this.allUserReview = res;
      this.tableData = res?.value ?? []
      this.dataSource.data = res?.value ?? [];
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }
  viewReview(value) {
    localStorage.setItem('selectedReview', JSON.stringify(value))
    this.router.navigate(['/self-review-form/' + value.reviewId]);
  }

  selectReviewType(designation?: any) {
    let filteredData = this.tableData.filter(item => item.type == designation?.id);
    this.dataSource.data = [...filteredData];
  }

  applyDesignationFilter(): void {
    const reviewTypeList = this.reviewTypeList;
    let filteredData;
    if (+reviewTypeList >= 0) {
      filteredData = this.tableData.filter(item => item.type == reviewTypeList);
      this.dataSource.data = [...filteredData];
      return;
    }
    this.dataSource.data = [...this.tableData];
  }

  getOptionLabel(option: ReviewType) {
    switch (option) {
      case ReviewType.Self:
        return "Self";
      case ReviewType.Peer:
        return "Peer";
      case ReviewType.Management:
        return "Management";
      default:
        throw new Error("Unsupported option");
    }
  }

}
