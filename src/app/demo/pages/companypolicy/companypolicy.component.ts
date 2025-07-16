import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { userRole } from 'src/app/assets.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastType } from 'src/app/demo/models/models';
import { LeaveStatusLable } from '../user-leave/user-leave.component';
import { LeaveRequestTypeLable } from '../admine-request-approval/admine-request-approval.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormControl, Validators } from '@angular/forms';
import { LoaderComponent } from "../../../loader/loader.component";
export interface companypolicy {
  id: string;
  name: string;
  description: string;
  type: string,
  isActive: string;
  policyType: string;


}
@Component({
  selector: 'app-companypolicy',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatTableModule, MatSlideToggleModule,
    SharedModule, LoaderComponent],
  templateUrl: './companypolicy.component.html',
  styleUrls: ['./companypolicy.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CompanypolicyComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  projectData: any = [];
  constructor(private router: Router,
    private apiService: ApiService,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,) {

  }
  public tableData: Array<companypolicy> = [];
  public userRole: Array<userRole> = [];
  type: string = '';
  typeControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z0-9 ]*$')
  ]);
  public searchDataValue = '';
  dataSource = new MatTableDataSource<companypolicy>();
  displayedColumns: string[] = ['name', 'description', 'type', 'isActive', 'actions'];
  loading: boolean = false
  async ngOnInit() {
    this.loading = true
    this.dataSource.data = await this.apiService.getcompanypolicyDetails();
    this.tableData = await this.apiService.getProjectDetails();
    this.loading = false


    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "CompanyPolicy";
      })
    }

  }
  getallcompanypolicy() {
    this.apiService.getcompanypolicyDetails();
  }
  editcompanypolicy(id?: string) {
    this.router.navigate([`company-policy-details/add-company-policy/${id}`]);
  }
  addcompanydetails() {
    this.router.navigate(['company-policy-details/add-company-policy'])
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  activeStatusChange(status: MatSlideToggleChange, data: any) {
    this.loading = true;
    this._commonService.put(`CompanyPolicy/${data}/active/${status.checked}`, '').subscribe(res => {
      this.loading = false;

      this.getallcompanypolicy();
      if (!res) {
        this.getallcompanypolicy();
      }
    },
      (error) => {

      })
  }
  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }

  getStatusLeaveTypeLabel(status: number): string {
    return LeaveRequestTypeLable[status] || 'Unknown';
  }

  AddcompanypolicyType() {
    if (this.type == '') {
      return;
    }
    this._commonService.post('PolicyType', { name: this.type, isActive: true }).subscribe((res) => {
      if (res?.statusCode == 200) {
        this._commonService.showToast('CompanyPolicy type added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.type = ""
      } else {
        this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })

  }

  public searchData(value: string): void {
    if (value) {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        return item.name.toLowerCase().includes(value.toLowerCase())
      });

    }
    return;
  }
  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    const customFilter = (data: companypolicy, filter: string): boolean => {
      return (
        ((data?.policyType['name'])?.toLowerCase() || '').includes(filter) ||
        ((data?.name)?.toLowerCase() || '').includes(filter)
      );
    }
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filter;
    if (this.dataSource.filteredData.length === 0) {
    }
  }
  getProjectDetails(name: string) {
    throw new Error('Method not implemented.');
  }
  getcompanypolicyDetails(type: string) {
    throw new Error('Method not implemented.');
  }
}
