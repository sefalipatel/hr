import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/service/common/common.model';
import { userRole } from 'src/app/assets.model';
export interface PeriodicElement { 
  Name: string;
  Subject: string;
  Body: string;
}
@Component({
  selector: 'app-template-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  loading : boolean = false;
  public userRole: Array<userRole> = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ["Name", 'Subject', 'actions'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource([]);

  constructor(
    private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Template";
      })
    }
    this.getAllTemplates();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onBtnClick(id?: string) {
    id ? this.router.navigate([`/system-template-details/add-template/${id}`]) : this.router.navigate(['/system-template-details/add-template']);
  }

  async deleteBtn(id: string) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Template/${id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Template deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllTemplates();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  getAllTemplates() {
    this.loading = true
    let orgId = localStorage.getItem('orgId')
    this._commonService.get('Template').subscribe((res) => {
      this.loading = false 
      if (res?.length) {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    }, (err) => {
      this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })
  }
}
