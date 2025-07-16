import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute , Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
export interface Payroll {
  id: string;
  name: string;
  calucationtype: string;
  status: string;
}

export enum CalculationType {
  Percentage = 0,
  Amount = 1
}
@Component({
  selector: 'app-payroll-component-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './payroll-component-list.component.html',
  styleUrls: ['./payroll-component-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PayrollComponentListComponent {
  public tableData: Array<Payroll> = [];
  loading : boolean = false;
  dataSource = new MatTableDataSource<Payroll>();
  displayedColumns: string[] = ['name', 'calucationtype', 'calculationAmount', 'condition', 'status', 'actions'];
  public sortConfig!: Sort;
  selectedType: string = 'Earning';
  @ViewChild(MatSort) sort: MatSort;

  @Input()
  set selectedIndex(value: number) {
    this._selectedIndex = value;
    this.selectedType = value == 0 ? 'Earning' : 'Deduction'; 
  }
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  @Input()
  set departmentId(value: string) {
    this._departmentId = value;
    
  }
  get departmentId(): string {
    return this._departmentId;
  }

  @Input()
  set designationId(value: string) {
    this._designationId = value;
    
  }
  get designationId(): string {
    return this._designationId;
  }

  checkAndGetData() {
    if (this.selectedType || (this._departmentId || this._designationId)) {
      this.getData(this.selectedType, this._departmentId || this._designationId);
    }
  }

  private _selectedIndex: number;
  private _departmentId!: string;
  private _designationId!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: CommonService,
    private sweetlalert: SweetalertService) {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort; 
  }

  ngOnInit() { 
    this.route.queryParams.subscribe(params => {
      if (!params['designationId']) {
        this.designationId = ""
        this.checkAndGetData();
      } 
    });
  }

  ngOnChanges() {
    this.checkAndGetData();
  }

  onBtnClick() {
    this.selectedType == 'Earning' ?
      this.router.navigate(['/salary-components-details/add-earning-component/new']) :
      this.router.navigate([`/salary-components-details/add-deduction-component/new`]);
  }

  editItem(id: string) {
    this.selectedType == 'Earning' ?
      this.router.navigate(['/salary-components-details/add-earning-component/edit/' + id]) :
      this.router.navigate([`/salary-components-details/add-deduction-component/edit/${id}`]);
  }
  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    
    if (confirmed) {
      this.apiService.delete(`Earning/${id}`).subscribe(
        (response: any) => {
          if (response?.isSuccessful) {
            this.apiService.showToast(
              `${this.selectedType === 'Earning' ? 'Earning' : 'Deduction'} deleted successfully`, 
              ToastType.SUCCESS, 
              ToastType.SUCCESS
            );
            this.getData(this.selectedType, null);
          } else {
            this.apiService.showToast(response.value || `${this.selectedType === 'Earning' ? 'Earning' : 'Deduction'} Deletion failed`, ToastType.ERROR, ToastType.ERROR);
          }
        },
        (error) => {
          this.apiService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }
  
  searchData(event: Event) {
    let value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        return item?.name.toLowerCase().includes(value.toLowerCase())
      });
    }
  }

  getData(type: string, Id: string = null) {
    this.loading = true
    this.dataSource.data = [];
    if(!Id){
        this.apiService.get(type).subscribe(res => {
        this.loading = false
        this.tableData = res;
        this.dataSource.data = this.tableData;
      })
    }else{
      const url = this.departmentId ? `${type}/list?departmentId=${this.departmentId}` : `${type}/list?designationId=${this.designationId}`;
      this.apiService.get(url).subscribe(res => {
        this.loading = false
        this.tableData = res;
        this.dataSource.data = this.tableData;
      })
    }
  }

  getReviewTypeName(type: number): string {
    return CalculationType[type];
  }

}
