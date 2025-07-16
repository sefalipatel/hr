import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { ToastType } from 'src/app/demo/models/models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanyListComponent {

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dateFormat: string = localStorage.getItem('Date_Format');
  displayedColumns: string[] = ['name', 'phoneNumber', 'email', 'description', 'actions'];
  public companyList: any;
  public searchDataValue = '';
  loading: boolean = false

  constructor(private _commonService: CommonService, private router: Router, private sweetlalert: SweetalertService) { }

  ngOnInit(): void {
    this.getCompanyData();
  }

  getCompanyData() {
    this.loading = true
    this._commonService.get(`CompanyPerson`).subscribe(res => {
      this.loading = false
      this.companyList = res;
      this.dataSource = new MatTableDataSource<any>(this.companyList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  addCompanyDetail() {
    this.router.navigate([`company-list/comapny-detail`]);
  }

  searchData(value) {
    if (value === "") {
      this.dataSource.data = this.companyList;
    } else {
      this.dataSource.data = this.companyList.filter((item) => {
        return item?.name.toLowerCase().includes(value.toLowerCase()) ||
          item?.phoneNumber?.toString().includes(value.toString()) ||
          item?.email?.toLowerCase().includes(value.toLowerCase()) ||
          item?.description?.toLowerCase().includes(value.toLowerCase())
      })
    }
  }

  editCompanyDetail(id) {
    this.router.navigate([`company-list/comapny-detail/${id}`]);
  }

  async deleteCompanyDeail(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`CompanyPerson/${id}`).subscribe((res) => {
        if (res) {
          this.dataSource = new MatTableDataSource<any>(this.dataSource.data.filter((item) => item.id !== id));
          this.getCompanyData();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this._commonService.showToast('Company deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }
  }
}
