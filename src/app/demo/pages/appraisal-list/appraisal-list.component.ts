import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';

@Component({
  selector: 'app-appraisal-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './appraisal-list.component.html',
  styleUrls: ['./appraisal-list.component.scss']
})
export class AppraisalListComponent implements OnInit, AfterViewInit {

  public searchDataValue = '';
  public tableData: Array<any> = [];
  dataSource = new MatTableDataSource<any>();
  dateFormat:string = localStorage.getItem('Date_Format');
  displayedColumns: string[] = ['employeeId', 'employeeName', 'designation', 'department', 'appraisal_date', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading : boolean = false
  constructor(
    private router: Router,
    private _commonService: CommonService,
    private sweetlalert: SweetalertService,
  ) { 
  }
  
  ngOnInit(): void {
    this.getAllAppraisalData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllAppraisalData() {
    this.loading = true
    this._commonService.get(`Appraisal`).subscribe((res: any[]) => {
      this.loading = false
      this.dataSource = new MatTableDataSource<any>(res);
      this.tableData = res;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  addAppraisal() {
    this.router.navigate([`appraisal/appraisal-detail`]);
  }

  editAppraisal(id: any) {
    this.router.navigate([`appraisal/appraisal-detail/${id}`]);
  }

  async deleteAppraisal(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Appraisal/${element}`).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.getAllAppraisalData();
        this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data;
    }
  }
  
  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return item?.personCode?.toLowerCase().includes(value.toLowerCase()) ||
          item?.firstName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.designation?.toLowerCase().includes(value.toLowerCase()) ||
          item?.departmentName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.appraisalDate?.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

}
