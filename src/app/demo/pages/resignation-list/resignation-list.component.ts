import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ApiService } from 'src/app/api.service';
import { ToastType } from 'src/app/service/common/common.model';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-resignation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatProgressSpinnerModule, MatSortModule, MatPaginatorModule, SharedModule, RouterModule],
  templateUrl: './resignation-list.component.html',
  styleUrls: ['./resignation-list.component.scss']
})
export class ResignationListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortConfig!: Sort
  dataSource = new MatTableDataSource<any>();
  resignationData = [];
  dateFormat: string = localStorage.getItem('Date_Format');
  public departmentList: any;
  public selectedDepartment: string | null = null;
  loading : boolean =false

  displayedColumns: string[] = ['employeeName', 'department', 'resignationDate', 'reason', 'cancellationDate', 'cancellationReason', 'noticeDate', 'approvedOn', 'actions'];

  constructor(private _commonService: CommonService, private apiService: ApiService, private sweetlalert: SweetalertService) {

  }

  ngOnInit() {
    this.getResignation();
    this.getDepartment();
  }

  async getResignation() {
    this.loading = true
    this.resignationData = await this.apiService.getResignation();
    this.loading = false
    this.dataSource = new MatTableDataSource(this.resignationData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.person ? a.person.personCode : null;
      const personCodeB = b.person ? b.person.personCode : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }

  async resignationApprove(id: any) {
    const confirmed = await this.sweetlalert.showApproveConfirmation();
    if (confirmed) {
      this._commonService.put(`Resignation/approve/${id}`, '').subscribe((res) => {
        if (res) {
          this._commonService.showToast(res.value, ToastType.SUCCESS, ToastType.SUCCESS)
          this.getResignation();
        }
      })
    }
  }

  // Department list
  getDepartment() {
    this._commonService.get('Department').subscribe(res => {
      this.departmentList = res;
    })
  }

  selectDepartment(department: any) {
    this.selectedDepartment = department?.departmentName;
    this.applyFilter();
  }

  applyFilter(): void {
    const selectedDepartment = this.selectedDepartment ? this.selectedDepartment.trim().toLowerCase() : '';
    let filteredData = this.resignationData;
    // Filter department
    if (selectedDepartment) {
      filteredData = filteredData.filter(item => {
        return item.department?.toLowerCase() === selectedDepartment;
      });
    }
    this.dataSource.data = filteredData;
  }

  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Resignation/${id}`).subscribe(res => {
        if (res == true) {
          this._commonService.showToast('Resignation deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getResignation();
        } else {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

}
