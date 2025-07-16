import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { OrgListPresenterService } from '../org-list-presenter/org-list-presenter.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Organization } from 'src/app/demo/models/models';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
interface data {
  value: string;
}
@Component({
  selector: 'app-org-list-presentation',
  standalone: true,
  imports: [CommonModule, SharedModule, MatProgressSpinnerModule, MatTableModule, CommonModule, MatPaginatorModule, MatSelectModule, RouterModule, MatTooltipModule],
  templateUrl: './org-list-presentation.component.html',
  styleUrls: ['./org-list-presentation.component.scss'],
  viewProviders: [OrgListPresenterService]
})
export class OrgListPresentationComponent implements OnInit, AfterViewInit {

  @Input() set organizationList(data: Organization[]) {

    this._organizationList = data;
    this.tableData = this._organizationList;
    this.organizationTableData = this._organizationList;
    this.dataSource = new MatTableDataSource<Organization>(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (data.length)
      data?.map(x => x.isSelected = false);
    this.getOrgData();
  }

  public get organizationList(): Organization[] {
    return this._organizationList;
  }
  @Input() public loading;

  initChecked = false;
  public tableData: Array<Organization> = [];
  public userRole: any[] = [];
  public organizationTableData: Array<Organization> = [];
  public imgBaseUrl: string = `${environment.apiUrl}`.replace('api/', '');
  public defaultImg: string = 'assets/images/img-navbar-card.png';
  public skip: number = 0
  public limit: number = 10
  public selectedValue1 = ''
  public searchDataValue = '';
  public sortConfig!: Sort
  public searchTerm: string = '';
  @Output() delete: EventEmitter<string> = new EventEmitter();
  @Output() status: EventEmitter<any> = new EventEmitter();

  selectedList3: data[] = [{ value: 'Brand' }, { value: 'N/D' }];
  displayedColumns: string[] = ['name', 'code', 'title', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<Organization>(this.tableData);
  private _organizationList: any;

  constructor(
    private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService, public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Organization";
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async deleteBtn(id: string | any) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.delete.emit(confirmed ? id : "")
    }
  }

  getOrgData() {
    this._commonService.get(`Organizations`).subscribe(
      (response) => {
        this.dataSource.data = response;
      },
      (err) => {
      }
    );
  }

  addOrganization() {
    this.router.navigate(['organization-details/add-organization'])
  }

  editOrganization(id: any) {
    this.router.navigate([`organization-details/add-organization/${id}`])
  }

  orgSettingBtn(id: any) {
    this.router.navigate([`organization-details/organization-setting-detail/${id}`])
  }

  orgaStructure(id: any) {
    this.router.navigate([`treeView/${id}`])
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.organizationTableData;
    } else {
      this.dataSource.data = this.organizationTableData.filter(item => {
        return item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.code.toLowerCase().includes(value.toLowerCase()) ||
          item.title.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

  public sortData(sort: Sort) {
    this.sortConfig = sort;
    return;
  }

  selectAll(initChecked: boolean) {
    if (!initChecked) {
      this.tableData.forEach((f) => {
        f.isSelected = true;
      });
    } else {
      this.tableData.forEach((f) => {
        f.isSelected = false;
      });
    }
  }

  activeStatusChange(status: MatSlideToggleChange, id: any) {
    this.status.emit({
      id: id,
      status: status.checked
    })
  }

  organizationAuthentication(id: any) {
    this.router.navigate([`organization-details/authentication-setting/${id}`])
  }

  onSubscription(id: string) {
    this.router.navigate([`organization-details/org-subscription/${id}`])
  }
}
