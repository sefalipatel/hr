import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { userRole } from 'src/app/assets.model';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asset-user-assignment',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, CommonModule, MatPaginatorModule, SharedModule],
  templateUrl: './asset-user-assignment.component.html',
  styleUrls: ['./asset-user-assignment.component.scss']
})

export class AssetUserAssignmentComponent {
  loading: boolean = false;
  isAssetAdd: boolean = false;
  
  public userRole: Array<userRole> = [];
  public searchDataValue = '';
  public sortConfig!: Sort
  public tableData: Array<UserAssignment> = [];
  dateFormat: string = localStorage.getItem('Date_Format');
  displayedColumns: string[] = Object.values(MyEnum);
  requestpage: boolean = false;
  dataSource = new MatTableDataSource<UserAssignment>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      let requestId = JSON.parse(localStorage.getItem('userInfo')).personID;
      this.api.get(`Person/${requestId}/assetAssignment`).subscribe(
        (response) => {
          this.dataSource.data = response
          this.tableData = response
        },
        (err) => {
        }
      );
    }
  }
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile!: boolean;

  @Input() public set isAssetCarryToHome(isAsset: boolean) {
    this._isAssetCarryToHome = isAsset;
  }

  public get isAssetCarryToHome(): boolean {
    return this._isAssetCarryToHome;
  }

  private _isAssetCarryToHome!: boolean;
  @Output() isAssetCarry: EventEmitter<boolean> = new EventEmitter();

  constructor(private api: CommonService, public dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.api.get(`Person/${this.requestId}/assetAssignment`).subscribe(
      (response) => {
        this.dataSource.data = response
        this.tableData = response
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onClick() {
    this.isAssetCarry.emit(true);
    this.requestpage = true;
    this.isAssetAdd = true;
  }
  closeForm(value) {
    this.requestpage = value;
    this.isAssetAdd = value;
  }
  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter(item => {
        return item.category?.categoryName.toLowerCase().includes(value.toLowerCase()) ||
          item.Asset.toLowerCase().includes(value.toLowerCase()) ||
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

export interface UserAssignment {
  Employeename: string,
  assetName: string,
  assetId: string,
  Asset: string,
  id: string,
  assignmentDate: string
  returnDate: string
  remark: string,
  category: any,
  categoryName: string
}

enum MyEnum {
  AssetId = 'assetId',
  CategoryName = 'categoryName',
  Asset = 'assetName',
  AssignmentDate = 'assignmentDate',
  ReturnDate = 'returnDate',
  Remark = 'remark',
}




