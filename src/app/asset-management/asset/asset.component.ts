import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { LoaderComponent } from "../../loader/loader.component";
export interface Asset {
  category: any;
  assetId: string;
  assetName: string;
  brand: string;
  status: number;
  isActive: boolean;
  categoryName: string
}
export enum AssetStatus {
  Available = 0,
  Assigned = 1,
  InMaintenance = 2
}
@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule, SharedModule, MatPaginatorModule, LoaderComponent]
})
export class AssetComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = false;
  public searchDataValue = '';
  selectedasset: number | null = null;
  selectedCategoryId: any
  public tableData: Array<Asset> = [];
  public userRole: Array<userRole> = [];
  public sortConfig!: Sort
  selectedRole: string | null = null;
  assetList: any[] = [0, 1, 2];
  displayedColumns: string[] = ['assetId', 'assetName', 'categoryName', 'brand', 'status', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<Asset>();

  constructor(
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService,
    private api: CommonService
  ) { }




  ngOnInit() {
    this.getAssetData();
    // this.selectedCategoryId =this.dataSource.data
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "AssetManagement";
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  async getAssetData() {
    this.loading = true
    this.dataSource.data = await this.apiService.getAsset();
    this.tableData = await this.apiService.getAsset();
    this.loading = false
  }

  async deleteItem(id: string) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      await this.apiService.deleteAsset(id);
      this.getAssetData();
      this.apiService.showToast('Asset deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
      this.searchDataValue = '';
    }
  }
  selectcategoryName(data?: any) {
    this.selectedCategoryId = data?.categoryId;
    this.applyDesignationFilter();
  }
  applyDesignationFilter(): void {
    const selectedCategoryId = this.selectedCategoryId ? this.selectedCategoryId.toString().trim().toLowerCase() : '';
    let filteredData;
    if (selectedCategoryId) {
      filteredData = this.tableData?.filter((item: any) => item?.categoryId == selectedCategoryId);
      this.dataSource.data = filteredData;
      return;
    }
    this.dataSource.data = this.tableData;
  }

  editItem(id: string) {
    this.router.navigate(['/asset-management/add-asset/' + id]);
    this.searchDataValue = '';
  }

  onBtnClick() {
    this.router.navigate(['/asset-management/add-asset']);
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        const searchStatus = this.getStatusString(item.status);
        return item.assetId.toLowerCase().includes(value.toLowerCase()) ||
          item.assetName.toLowerCase().includes(value.toLowerCase()) ||
          item.category?.categoryName.toLowerCase().includes(value.toLowerCase()) ||
          searchStatus.toLowerCase().includes(value.toLowerCase()) ||
          item.brand.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

  public sortData(sort: Sort) {
    this.sortConfig = sort;
    return;
  }

  getStatusString(status?: AssetStatus): string {
    switch (status) {
      case AssetStatus.Available:
        return 'Available';
      case AssetStatus.Assigned:
        return 'Assigned';
      case AssetStatus.InMaintenance:
        return 'In Maintenance';
      default:
        return '';
    }
  }
  selectasset(status?: any) {
    this.selectedasset = +status;
    this.applyFilter();
  }

  applyFilter(): void {
    const selectedasset = this.selectedasset;
    let filteredData;
    if (selectedasset >= 0) {
      filteredData = this.tableData.filter(item => {
        return item.status == selectedasset;
      });
      this.dataSource.data = filteredData;
      return;
    }
    this.dataSource.data = this.tableData;
  }

  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow['AssetName'] = row?.assetName;
          filteredRow['categoryName'] = row.category?.categoryName;
          filteredRow[column] = row[column];
          filteredRow['brand'] = row?.brand;
        }
      });
      return filteredRow;
    });
    this.api.exportAsExcelFile(filteredData, 'AssetManagementList', this.displayedColumns);
  }
}
