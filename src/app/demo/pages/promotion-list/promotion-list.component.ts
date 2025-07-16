import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule],
  templateUrl: './promotion-list.component.html',
  styleUrls: ['./promotion-list.component.scss']
})
export class PromotionListComponent implements OnInit {
  public searchDataValue = '';
  public getAllPromotionList: any;
  public selectedDepartment: string | null = null;
  public selectedDesignation: string | null = null;
  public departmentList: any;
  public designationList: any[] = [];
  displayedColumns = ['promotedEmployee', 'department', 'promotionDesignationFrom', 'promotionDesignationTo', 'promotionDate', 'action']
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dateFormat: string = localStorage.getItem('Date_Format');
  loading : boolean = false

  constructor(private router: Router, private commonService: CommonService, private sweetlalert: SweetalertService,) { }

  ngOnInit(): void {
    this.getAllPromotion();
    this.getDepartment();
    this.getAllDesignation();
  }

  getAllPromotion() {
    this.loading =true
    this.commonService.get('Promotion').subscribe(res => {
      this.loading = false
      this.getAllPromotionList = res;
      this.dataSource = new MatTableDataSource<any>(this.getAllPromotionList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  addPromotion() {
    this.router.navigate(['promotion/promotion-form']);
  }

  // Delete particular employee data
  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    this.commonService.delete(`Promotion/${id}`).subscribe(res => {
      if (res) {
        this.commonService.showToast('Promotion deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.getAllPromotion();
      } else {
        this.commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this.commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    });
  }

  edit(id) {
    this.router.navigate([`promotion/promotion-form/${id}`]);
  }

  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.getAllPromotionList;
    } else {
      this.dataSource.data = this.getAllPromotionList.filter((item) => {
        return item?.employeeName.toLowerCase().includes(value.toLowerCase())
      })
    }
  }

  // Department list
  getDepartment() {
    this.commonService.get('Department').subscribe(res => {
      this.departmentList = res;
    })
  }

  // get all designation list
  getAllDesignation() {
    this.commonService.get(`Designation`).subscribe((res) => {
      this.designationList = res;
    })
  }

  selectDepartment(department: any) {
    this.selectedDepartment = department?.departmentName;
    this.applyFilter();
  }

  selectDesignation(designation?: any) {
    this.selectedDesignation = designation?.name;
    this.applyFilter();
  }

  applyFilter(): void {
    const selectedDepartment = this.selectedDepartment ? this.selectedDepartment.trim().toLowerCase() : '';
    let filteredData = this.getAllPromotionList;
    // Filter department
    if (selectedDepartment) {
      filteredData = filteredData.filter(item => {
        return item.department?.toLowerCase() === selectedDepartment;
      });
    }
    if (this.selectedDesignation) {
      filteredData = this.getAllPromotionList?.filter(item => {
        return item.designation?.name?.trim().toLowerCase().includes(this.selectedDesignation.trim().toLowerCase());
      });
      this.dataSource.data = filteredData;
    }
    this.dataSource.data = filteredData;
  }

}
