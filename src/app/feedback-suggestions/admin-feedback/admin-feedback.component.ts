import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { FeedbackRemarkComponent } from '../feedback-remark/feedback-remark.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'primeng/api';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface feedback {
  id: number;
  employesname: string;
  subject: string;
  comment: string;
  status: string;
  remark: string;
}

export enum SuggestionType {
  Suggestion,
  Feedback,
  Complaint,
  Announcement
}
@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.scss'],
  standalone: true,
  imports: [MatTableModule,
    CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatPaginatorModule, MatProgressSpinnerModule, SharedModule, MatSortModule, MatTooltipModule],
})
export class AdminFeedbackComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortConfig!: Sort
  months: { value: number, name: string }[] = [
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
  selectedMonth: number
  selectedYear: number;
  years: number[] = [];
  feebbackData = [];
  loading: boolean = false;
  public suggestionType = SuggestionType;
  suggestionTypeList = [
    { name: 'Suggestion', value: 0 },
    { name: 'Feedback', value: 1 },
    { name: 'Complaint', value: 2 },
    { name: 'Announcement', value: 3 }
  ];
  public selectedSuggestionType: string | null = null;
  public getSuggestions: any;
  public userRole: Array<userRole> = [];

  constructor(public dialog: MatDialog, private api: CommonService, private sweetlalert: SweetalertService) { }

  public tableData: Array<feedback> = [];
  displayedColumns: string[] = ['employeesname', 'subject', 'comment', 'suggestionType', 'status', 'isApproved', 'remark', 'actions'];
  dataSource: MatTableDataSource<feedback> = new MatTableDataSource([]);
  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    this.getFeedback();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Employee";
      })
    }
  }

  async getFeedback() {
    this.loading = true
    this.api.get(`Suggestion?month=${this.selectedMonth}&year=${this.selectedYear}`).subscribe((response) => {
      this.loading = false
      this.dataSource = new MatTableDataSource(response);
      this.getSuggestions = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month
    this.getFeedback()

  }
  async onYearSelected(year) {
    this.selectedYear = year
    this.getFeedback()

  }
  convertStatus(value) {
    const status = ['Open', 'Close'];
    let list = status.filter((item, index) => index == value);
    return list;
  }
  convertSuggestionType(value) {
    const type = ['Suggestion', 'Feedback', 'Complaint', 'Announcement'];
    let list = type.filter((item, index) => index == value);
    return list;
  }

  resetButton() {
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.getFeedback();
  }

  openPopup(element): void {
    const elementData = element
    const date = element.date
    const id = element.id
    const Status = element.status

    const dialogRef = this.dialog.open(FeedbackRemarkComponent, {
      width: '800px',
      data: { date, id, Status, elementData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef.close();
      if (result)
        this.getFeedback();
    });
  }

  selectSuggestionType(type: { name: any, value: any }): void {
    this.selectedSuggestionType = type.value;
    this.applyFilter();
  }

  applyFilter(): void {
    const selectedSuggestionType = this.suggestionTypeList;
    let filteredData = this.getSuggestions;
    // Filter suggestion type
    if (this.selectedSuggestionType !== null) {
      filteredData = filteredData.filter(item => {
        return item.suggestionType === this.selectedSuggestionType;
      });
    }
    this.dataSource.data = filteredData;
  }

  async showStatusConfirmation(event: Event, id: any) {
    const confirmed = await this.sweetlalert.showStatusConfirmation();

    const target = event.target as HTMLInputElement;
    const status = target.checked;
    const originalChecked = !target.checked;

    if (confirmed) {
      // let userId = JSON.parse(localStorage.getItem('userInfo')).personID;
      this.api.put(`Suggestion/IsApproved?id=${id}&isApproved=${status}`, '').subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this.api.showToast('Status changed successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getFeedback();
        }
      }, (error) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      (event.target as HTMLInputElement).checked = originalChecked;
    }
  }

}
