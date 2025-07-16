import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';

@Component({
  selector: 'app-organization-setting-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatTableModule, MatTooltipModule],
  templateUrl: './organization-setting-list.component.html',
  styleUrls: ['./organization-setting-list.component.scss']
})
export class OrganizationSettingListComponent implements OnInit {

  public searchDataValue = '';
  public tableData: Array<any> = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['title', 'value',  'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private _commonService: CommonService,
    private sweetlalert: SweetalertService,
  ) { 
  }

  ngOnInit(): void {
    this.getAllOrganizationData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllOrganizationData() {
    this._commonService.get(`OrganizationSetting`).subscribe((res: any[]) => {
      this.dataSource = new MatTableDataSource<any>(res);
      this.tableData = res;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  editOrganization(id: any) {
    this.router.navigate([`organization-setting-detail/${id}`]);
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return item?.title?.toLowerCase().includes(value.toLowerCase()) ||
          item?.value?.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

  async deleteOrganization(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`OrganizationSetting/${element}`).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.getAllOrganizationData();
        this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data;
    }
  }

  onOrganizationList() {
    this.router.navigate(['organization-details'])
  }
}
