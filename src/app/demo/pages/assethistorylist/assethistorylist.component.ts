import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'src/app/service/common/common.service';
import { AssetcarrytohomeComponent } from '../assetcarrytohome/assetcarrytohome.component';
import { userRole } from 'src/app/assets.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
 
enum AssetEnum {
  name = "name",
  assetId = "assetId",
  category = "category",
  assetName = "assetName",
  reason = "reason",
  startDate = "startDate",
  endDate = "endDate",
}
@Component({
  selector: 'app-assethistorylist',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule,MatProgressSpinnerModule, FormsModule, MatTableModule, MatSelectModule,MatTooltipModule, AssetcarrytohomeComponent],
  templateUrl: './assethistorylist.component.html',
  styleUrls: ['./assethistorylist.component.scss']
})
export class AssethistorylistComponent {
  months: { value: number; name: string }[] = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  selectedMonth: number;
  selectedYear: number;
  years: number[] = [];
  totalnumberPresant: any
  personId: any
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  assetList: any[];
  loading: boolean = false;
  public userRole: Array<userRole> = [];
  requestpage: boolean = false;
  isAssetAdd: boolean = false;
  dateFormat:string = localStorage.getItem('Date_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
    if (this._requestId) {
      this.getAssetHistoryById(this.requestId);
      this.displayedColumns =  requestId ? Object.values(AssetEnum).filter(column => column != 'name') : Object.values(AssetEnum);
    }
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;
  
  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    this.personId = JSON.parse(localStorage.getItem('userInfo')).personID;
    if (profile && this.personId) {
      this.getAssetHistoryById(this.personId);
      this.displayedColumns = this._isProfile && this.requestId ? Object.values(AssetEnum).filter(column => column != 'name') : Object.values(AssetEnum);
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;

  constructor(
    private api: CommonService) {
      this.displayedColumns =  Object.values(AssetEnum);
  }
  ngOnInit(): void {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "employee-details";
      })
    }
    if (!this.isProfile && !this.requestId)
      this.getAssetHistory();
  }

  onAssetActionClick(event) {
    this.isAssetAdd = false;
    if (event) {
      if (this.personId && this.isProfile) {
        this.getAssetHistoryById(this.personId)
      }
      else if (this._requestId) {
        this.getAssetHistoryById(this.requestId)
      }
      else {
        this.getAssetHistory()
      }
    }
  }

  getAssetHistory() {
    this.loading = true;
    this.api.get(`AssetCarryToHome/AllAssetCarryToHomeByMonthYear?year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((response) => {
      this.loading = false
      this.dataSource = new MatTableDataSource(response.value);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      response?.table?.map((x) => {
      });
    })
  }

  getAssetHistoryById(id: string) {
    this.api.get(`AssetCarryToHome/AssetCarryByPersonId?personId=${id}`).subscribe((response) => {
      this.dataSource = new MatTableDataSource(response.value);
    })
  }
  onMonthSelected(Month) {
    this.selectedMonth = Month;
      this.getAssetHistory();
  }
  async onYearSelected(year) {
    this.selectedYear = year;
    if (this.selectedYear)
      this.getAssetHistory();
  }
  resetButton() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getAssetHistory();
  }
}
