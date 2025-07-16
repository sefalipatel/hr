import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-inquiry-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule],
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss']
})
export class InquiryListComponent {
  public inquiryList: any;
  loading : boolean = false;
  dateFormat:string = localStorage.getItem('Date_Format');
  public displayedColumns: string[] = ['fullName',  'phoneNumber', 'email', 'inquiryFor', 'date', 'requirement', 'organization', 'designation', 'location', 'action'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _commonService: CommonService) { }

  ngOnInit(): void {
    this.getInquiryData();
  }

  getInquiryData() {
    this.loading = true
    this._commonService.get('Inquiry').subscribe(res => {
      this.loading =false
      this.inquiryList = res
      this.dataSource = new MatTableDataSource<any>(this.inquiryList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  deleteInquiry(id) {
    this._commonService.delete(`Inquiry?id=${id}`).subscribe(res => {
      this.getInquiryData();
    })
  }
}
