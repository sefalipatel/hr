import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ToastType } from '../../models/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';
export interface broadcastlist { 
  Name: string;
  Description: string;
  StartDate: string;
  EndDate: string;
}
@Component({
  selector: 'app-broadcast-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatTableModule, MatSlideToggleModule
    , SharedModule],
  templateUrl: './broadcast-list.component.html',
  styleUrls: ['./broadcast-list.component.scss']
})
export class BroadcastListComponent {

  constructor(private router: Router,
    private apiService: ApiService,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,) {

  }
  public tableData: Array<broadcastlist> = [];
  public userRole: Array<userRole> = [];
  type: string = '';
  dataSource = new MatTableDataSource<broadcastlist>();
  public sortConfig!: Sort
  dateFormat:string = localStorage.getItem('Date_Format');
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'description', 'isActive', 'actions'];
  loading: boolean = false
  async ngOnInit() { 
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "CompanyPolicy";
      })
    }
    this.getAllBroadcast();
  }
  getAllBroadcast() {
    this.loading = true;
    this._commonService.get(`broadcast`).subscribe((res: broadcastlist[]) => {
      this.dataSource.data = res;
      this.tableData = res;
      this.loading = false;
    })
  }
  addbroadcast() {
    this.router.navigate(['broadcast/broadcast-form'])
  }
  activeStatusChange(status: MatSlideToggleChange, data: any) {
    this.loading = true;
    this._commonService.put(`CompanyPolicy/${data}/active/${status.checked}`, '').subscribe(res => {
      this.loading = false;

      this.getAllBroadcast();
      if (!res) {
        this.getAllBroadcast();
      }
    },
      (error) => {

      })
  }
  editbroadcast(id?: string) {
    this.router.navigate([`broadcast/broadcast-form/${id}`]);
  }
  async deleteBtn(row) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Broadcast/${row.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Broadcast deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllBroadcast();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
