import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatPaginator } from '@angular/material/paginator';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatSort, Sort } from '@angular/material/sort';
import { PayrollComponentListComponent } from '../payroll-component-list/payroll-component-list.component';
export interface earning {
  id: string;
  name: string;
  calucationtype: string;
  status: string;
}
@Component({
  selector: 'app-salary-earning',
  templateUrl: './salary-earning.component.html',
  styleUrls: ['./salary-earning.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, PayrollComponentListComponent],
  encapsulation: ViewEncapsulation.None,
})
export class SalaryEarningComponent implements OnInit {
  public tableData: Array<earning> = [];
  dataSource = new MatTableDataSource<earning>();
  displayedColumns: string[] = ['name', 'calucationtype', 'status', 'actions'];
  public sortConfig!: Sort
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectTabIndex = 0;
  loading : boolean = false;
  departmentId  : string;
  designationId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: CommonService,
    private api: CommonService,
    private sweetlalert: SweetalertService) {
    this.selectTabIndex = this.route.snapshot.queryParamMap.get('type') == 'Deduction' ? 1 : 0;
    this.designationId = this.route.snapshot.queryParamMap.get('designationId'); 
  }
  

  public sortData(sort: Sort) {
    this.sortConfig = sort; 
    return;
  }

  async ngOnInit() {
    this.departmentId=this.route.snapshot.params['id']; 
  }

  getAllEarningData() {

    if(!this.departmentId && !this.designationId){
      this.loading = true
      this.apiService.get(`Earning`).subscribe((response) => {
        this.loading =false
        this.dataSource.data = response
      })
    }else{
      const url = this.departmentId ? `Earning/list?departmentId=${this.departmentId}` : `Earning/list?designationId=${this.designationId}`;
      this.loading = true
      this.apiService.get(url).subscribe((response) => {
        this.loading =false
        this.dataSource.data = response
      })
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  onBtnClick() {
    this.router.navigate(['/salary-components-details/add-earning-component']);
  }

  editItem(id: string) {
    this.router.navigate(['/salary-components-details/add-earning-component/' + id]); 
  }
  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      const response = this.apiService.delete(`Earning/${id}`).subscribe((response) => {
        this.dataSource.data = response
        this.getAllEarningData();
      })
    }
  }
  searchData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const customFilter = (data, filter: string): boolean => {
      return (

        data.name.toLowerCase().includes(filter) || data.calucationType.toLowerCase().includes(filter)
      );
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length === 0) {
    }
  }

  onTabChange(index) {
    this.selectTabIndex = index;
  }

}
