import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { userRole } from 'src/app/assets.model';
import { Insurance } from '../../models/models';
import { MatSort } from '@angular/material/sort';
import { ToastType } from 'src/app/service/common/common.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-insurace-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, SharedModule, MatProgressSpinnerModule,MatIconModule,MatMenuModule],
  templateUrl: './insurace-list.component.html',
  styleUrls: ['./insurace-list.component.scss']
})
export class InsuraceListComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  public searchDataValue = '';
  public userRole: Array<userRole> = [];
  public tableData: Array<Insurance> = [];
  dataSource = new MatTableDataSource<Insurance>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['companyName', 'planType', 'coverAmount', 'coveragePeriod', 'cover', 'actions'];
  constructor(
    private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
  ) {
  }
  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Insurance";
      })
    }
    this.getAllInsuranceData();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        filteredRow['companyName'] = row?.companyName;
        filteredRow['planType'] = row?.planType;
        filteredRow['coverAmount'] = row?.coverAmount;
        filteredRow['coveragePeriod'] = row?.coveragePeriod;
        filteredRow['cover'] = row?.cover;
      });
      return filteredRow;
    });
    this._commonService.exportAsExcelFile(filteredData, 'InsuranceList', this.displayedColumns);
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return item.companyName.toLowerCase().includes(value.toLowerCase())
          || item.planType.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }
  addinsurance() {
    this.router.navigate(['insurance-master/add-company'])
  }

  activeStatusChange(status: Event, id: any) {
    this.loading = true;
    this._commonService.post(`Insurance`, '').subscribe(res => {
      this.loading = false;
      this.getAllInsuranceData();
    }, (error) => {
    })
  }
  editInsurance(id: any) {
    id ? this.router.navigate([`insurance-master/add-company/${id}`]) : this.router.navigate(['insurance-master/add-company']);
  }

  async deleteBtn(id: string) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Insurance/${id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Insurance deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllInsuranceData();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  getAllInsuranceData() {
    this.loading = true;
    this._commonService.get(`Insurance`).subscribe((res: Insurance[]) => {
      this.dataSource.data = res;
      this.tableData = res;
      this.loading = false;
    })
  }
}
