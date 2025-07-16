import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApiService } from 'src/app/api.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
import { ToastType } from 'src/app/service/common/common.model';
import { LoaderComponent } from "../../loader/loader.component";

export interface Category {
  categoryId: string;
  categoryName: string;
}

@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.scss'],
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatButtonModule,
    SharedModule,
    MatProgressSpinnerModule, MatPaginatorModule, LoaderComponent]
})
export class AssetCategoryComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  public userRole: Array<userRole> = [];
  public searchDataValue = '';
  public tableData: Array<Category> = [];
  public sortConfig!: Sort
  displayedColumns: string[] = ['categoryId', 'categoryName', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService
  ) { }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getCategoryData();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "AssetManagement";
      })
    }
  }

  async getCategoryData() {
    this.loading = true
    this.dataSource.data = await this.apiService.getCategory();
    this.tableData = await this.apiService.getAsset();
    this.loading = false
  }
  async deleteItem(id: string) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      const categoryDelete = await this.apiService.deleteCategory(id);
      if (categoryDelete.statusCode == 200) {
        this.apiService.showToast('Asset category deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.getCategoryData();
        this.searchDataValue = '';
      } else if (categoryDelete.statusCode != 200) {
        this.apiService.showToast(categoryDelete?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }
  }

  editItem(id: string) {
    this.router.navigate(['/asset-category-details/add-asset-category/' + id]);
    this.searchDataValue = '';
  }

  onBtnClick() {
    this.router.navigate(['/asset-category-details/add-asset-category']);
  }

  public searchData(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const customFilter = (data: Category, filter: string): boolean => {
      return (
        data.categoryId.toLowerCase().includes(filter) || data.categoryName.toLocaleLowerCase().includes(filter)
      )
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filterValue;

  }
  public sortData(sort: Sort) {
    this.sortConfig = sort;
    ;
    return;
  }
}
