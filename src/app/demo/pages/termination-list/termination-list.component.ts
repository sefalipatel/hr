import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { SharedModule } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export enum TerminationType {
  Dismissal,
  Termination
}
@Component({
  selector: 'app-termination-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatProgressSpinnerModule, MatPaginatorModule, SharedModule, RouterModule, FormsModule],
  templateUrl: './termination-list.component.html',
  styleUrls: ['./termination-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TerminationListComponent {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['employeeName', 'department', 'terminationType', 'terminationDate', 'reason', 'noticeDate'];
  public getTerminationList: any;
  public terminationType = TerminationType;
  public selectedDepartment: string | null = null;
  public departmentList: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  terminatedType = [
    { name: 'Dismissal', value: 0 },
    { name: 'Termination', value: 1 }
  ];
  public selectedTerminationType: number | null = null;
  public searchDataValue = '';
  loading: boolean = false

  constructor(private _commonService: CommonService, private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.getTerminationDetail();
    this.getDepartment();
  }

  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.employeeName ? a.employeeName.personCode : null;
      const personCodeB = b.employeeName ? b.employeeName.personCode : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }

  // Get all data
  getTerminationDetail() {
    this.loading = true
    this._commonService.get('Termination').subscribe(res => {
      this.loading = false
      this.getTerminationList = res;
      this.dataSource = new MatTableDataSource<any>(this.getTerminationList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  // Department list
  getDepartment() {
    this._commonService.get('Department').subscribe(res => {
      this.departmentList = res;
    })
  }

  // search functionality by name
  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.getTerminationList;
    } else {
      this.dataSource.data = this.getTerminationList.filter((item) => {
        return item?.employeeName.toLowerCase().includes(value.toLowerCase())
      })
    }
  }

  selectDepartment(department: any) {
    this.selectedDepartment = department?.departmentName ?? '';
    this.applyFilter();
  }

  selectTerminationType(type: { name: string, value: number }): void {
    this.selectedTerminationType = type ? type.value : null;
    this.applyFilter();
  }

  applyFilter(): void {
    const selectedDepartment = this.selectedDepartment ? this.selectedDepartment.trim().toLowerCase() : '';
    const selectedTerminationType = this.terminatedType;
    let filteredData = this.getTerminationList;
    // Filter department
    if (selectedDepartment) {
      filteredData = filteredData.filter(item => {
        return item.department?.toLowerCase() === selectedDepartment;
      });
    }
    // Filter termination type
    if (this.selectedTerminationType !== null) {
      filteredData = filteredData.filter(item => {
        return item.terminationType === this.selectedTerminationType;
      });
    }
    this.dataSource.data = filteredData;
  }

}
