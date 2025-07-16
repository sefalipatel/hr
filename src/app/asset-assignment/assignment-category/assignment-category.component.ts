import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { userRole } from 'src/app/assets.model';

@Component({
  selector: 'app-assignment-category',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, CommonModule, MatPaginatorModule, SharedModule],
  templateUrl: './assignment-category.component.html',
  styleUrls: ['./assignment-category.component.scss']
})
export class AssignmentCategoryComponent {
  loading: boolean = false;

  constructor(private api: CommonService, public dialog: MatDialog, private router: Router, private sweetlalert: SweetalertService,) {
  }
  public userRole: Array<userRole> = [];
  public searchDataValue = '';
  public sortConfig!: Sort
  public tableData: Array<PeriodicElement> = [];
  displayedColumns: string[] = Object.values(MyEnum);
  dataSource = new MatTableDataSource<PeriodicElement>();
  dateFormat:string = localStorage.getItem('Date_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {

    this.api.get(`AssetAssignment`).subscribe(
      (response) => {
        this.tableData = response;
        this.dataSource = new MatTableDataSource<any>(response);
       
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
      }
    );
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "AssetManagement";
      })
    }
  }

  AddAssignment() {
    this.router.navigate(['asset-assign-details/assign-asset'])
  }

  async deleteAssignment(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`AssetAssignment/${element.id}`).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.api.showToast('Asset Assignment deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
      })
      this.dataSource.data
    }
  }

  editAssignment(element) {
    this.router.navigate([`asset-assign-details/assign-asset/${element.id}`])
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return item.userName.toLowerCase().includes(value.toLowerCase()) ||
          item.assetName.toLowerCase().includes(value.toLowerCase()) ||
          item.assetId.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

  public sortData(sort: Sort) {
    this.sortConfig = sort;
    return;
  }
}


export interface PeriodicElement {
  userName: string;
  Employeename: string,
  assetName: string,
  returnDate: string
  assignmentDate: string,
  assetId: string,
  Asset: string,
  id: string
}

enum MyEnum {
  Employeename = 'userName',
  AssetId = 'assetId',
  Asset = 'assetName',
  AssignmentDate = 'assignmentDate',
  ReturnDate = 'returnDate',
  Actions = 'actions',

}


