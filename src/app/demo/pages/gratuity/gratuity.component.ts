import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from 'primeng/api';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { userRole } from 'src/app/assets.model';
import { CommonService } from 'src/app/service/common/common.service';

export interface gratuity { 
  employeeName?: string,
  startDate?: string,
  gratuityAmount?: string
  joiningDate?: string
  totalAmount?: string
}

enum gratuityEnum {
  employeeName = 'employeeName',
  gratuityAmount = 'gratuityAmount',
  joiningDate = 'joiningDate',
  totalAmount = 'totalAmount'
}
@Component({
  selector: 'app-gratuity',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, SharedModule, MatFormFieldModule, FormsModule],
  templateUrl: './gratuity.component.html',
  styleUrls: ['./gratuity.component.scss']
})


export class GratuityComponent {
  public searchDataValue = '';
  dataSource = new MatTableDataSource<gratuity>();
  displayedColumns: string[] = Object.values(gratuityEnum);
  public tableData = [];
  public userRole: Array<userRole> = [];
  public allgratuitylist: any;
  dateFormat:string = localStorage.getItem('Date_Format');
  loading : boolean = false 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _commonservice: CommonService) { }

  ngOnInit() {
    this.getAllGratuity();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Gratuity";
      })
    }
  }
  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        filteredRow['employeeName'] = row?.employeeName;
        filteredRow['gratuityAmount'] = row?.gratuityAmount;
        filteredRow['joiningDate'] = row?.joiningDate;
        filteredRow['totalAmount'] = row?.totalAmount;
      });
      return filteredRow;
    });
    this._commonservice.exportAsExcelFile(filteredData, 'GratuityList', this.displayedColumns);
  }
  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.allgratuitylist;
    } else {
      this.dataSource.data = this.allgratuitylist.filter((item) => {
        return item?.employeeName.toLowerCase().includes(value.toLowerCase()) ||
          item?.gratuityAmount.toString().includes(value.toString()) ||
          item?.joiningDate?.toString().includes(value.toString());
      });
    }
  }

  getAllGratuity() {
    this.loading = true
    this._commonservice.get('Gratuity/getGratuity').subscribe(res => {
      this.loading = false
      this.allgratuitylist = res;
      this.dataSource = new MatTableDataSource<any>(this.allgratuitylist);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.employeeName ? a.employeeName : null;
      const personCodeB = b.employeeName ? b.employeeName : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }

}

