import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
export interface deduction {
  id: string;
  name: string;
  calucationType: string;
  status: string;
}
@Component({
  selector: 'app-deduction',
  templateUrl: './deduction.component.html',
  styleUrls: ['./deduction.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, FormsModule, SharedModule, MatSortModule]
})
export class DeductionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public tableData: Array<deduction> = [];
  loading : boolean = false; 
  dataSource = new MatTableDataSource<deduction>();
  displayedColumns: string[] = ['name', 'calucationtype', 'status', 'actions'];
  public searchDataValue: string = '';

  constructor(private router: Router,
    private api: CommonService,
    private sweetlalert: SweetalertService) {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getDeductionData();
  }

  // get deduction list
  async getDeductionData() {
    this.loading = true
    this.api.get('Deduction').subscribe(res => {
      this.loading = false
      this.tableData = res;
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
    })
  }

  onBtnClick() {
    this.router.navigate(['/salary-components-details/add-deduction-component']);
  }

  editItem(element) {
    this.router.navigate([`/salary-components-details/add-deduction-component/${element.id}`]);
  }

  // delete selected items
  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Deduction/${element.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this.api.showToast('Deduction deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getDeductionData();
        } else if (res?.statusCode == 400 || !res) {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  searchData(value) {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        return item.id.toLowerCase().includes(value.toLowerCase()) ||
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.calucationType?.toString()?.includes(value.toString())
      });
    }
    return;
  }
}
