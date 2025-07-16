import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userRole } from 'src/app/assets.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { JobinquiryRemarkPopupComponent } from '../jobinquiry-remark-popup/jobinquiry-remark-popup.component';
import { MatDialog } from '@angular/material/dialog';

export interface jobdatadata {
  id: string;
  fullName: string;
  location: string;
  email: string;
  status: string;
  Docfile: string
}
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-jobinquiry',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, SharedModule, MatTooltipModule, RouterModule],
  templateUrl: './jobinquiry.component.html',
  styleUrls: ['./jobinquiry.component.scss']
})
export class JobinquiryComponent implements OnInit{
 
  isForm?: boolean = false;
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
  public searchDataValue = '';
  public userRole: Array<userRole> = [];
  public jobinquryList: Array<any>;
  private requestId!: string;
  public tableData: Array<jobdatadata> = [];
  displayedColumns: string[] = ['fullName','date', 'email', 'location', 'message','remarks', 'action', 'Docfile'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filesave: string;
  selectedMonth: number;
  selectedYear: number;
  attachmentUrl: string = environment.apiUrl.replace('api/', '')
  years: number[] = [];
  totalnumberPresant: any
  showEmoji = true;
  loading: boolean = false;
  constructor(private _commonService: CommonService, private route: ActivatedRoute,
    private router: Router, private sweetlalert: SweetalertService,
    private api: CommonService,
    public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID;

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
        return item?.module?.module === "Expense";
      })
    }
    this.getjobinquiry();
  }
  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.jobinquryList;
    } else {
      this.dataSource.data = this.jobinquryList.filter((item) => {
        return item?.fullName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.email?.toString().includes(value.toString())
      })
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.person ? a.person.personCode : null;
      const personCodeB = b.person ? b.person.personCode : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }
  onMonthSelected(Month) {
    this.selectedMonth = Month;
    this.getjobinquiry();
  }
  async onYearSelected(year) {
    this.selectedYear = year;
    this.getjobinquiry();
  }
  resetButton() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getjobinquiry();
  }
  download(text) {
    saveAs(this.attachmentUrl + text.cvFile.replace('wwwroot\\', ''), text.name + '_resume');
  };
  getjobinquiry() {
    this.loading =true
    this.api.get(`JobInquiry/JobInquiry?&year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((response) => {
      this.loading = false
      this.dataSource = new MatTableDataSource(response);
      this.tableData = response;
      this.jobinquryList = response;
      this.filesave = response.cvFile;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })

  }
  openpoup(data) {
     const dialogRef = this.dialog.open(JobinquiryRemarkPopupComponent, {
      width: '800px',
      data: { id: data.id, dataSource: this.dataSource.data?.find(x => x.id == data.id) },

    });
    dialogRef.componentInstance.remarks.subscribe((value) => {
      if (value) {
        this._commonService.put(`JobInquiry/${value.id}/status/${value.status}?remarks=${value.remark}`, {}).subscribe(
          (res) => {
            dialogRef.close();
            this.getjobinquiry();
            if (!res) {
              this.getjobinquiry();
            }
          },
          (error) => { }
        );
      }
    })


  }
  exportJson(): void {
    this.api.exportAsExcelFile(this.dataSource.data, 'ExpenseList');
  }

}