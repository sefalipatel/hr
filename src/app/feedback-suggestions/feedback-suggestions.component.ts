import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { ApiService } from '../api.service';
import { CommonService } from '../service/common/common.service';
import { SweetalertService } from '../demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from "../loader/loader.component";

export interface Suggestions {
  id: string;
  subject: string;
  comment: string;
  suggestionType: string
  remark: string;
  status: string;
}

interface SuggestionType {
  name: string;
  value: number;
}
@Component({
  selector: 'app-feedback-suggestions',
  templateUrl: './feedback-suggestions.component.html',
  styleUrls: ['./feedback-suggestions.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, FormsModule, SharedModule, MatSortModule, MatTooltipModule, LoaderComponent]
})
export class FeedbackSuggestionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  suggestionData: any = [];
  public tableData: Array<Suggestions> = [];
  dataSource = new MatTableDataSource<Suggestions>();
  displayedColumns: string[] = ['subject', 'comment', 'suggestionType', 'remarks', 'status', 'actions'];
  public sortConfig!: Sort;
  loading: boolean = false
  public selectedSuggestionType: string | null = null;
  suggestionTypeList = [
    { name: 'Suggestion', value: 0 },
    { name: 'Feedback', value: 1 },
    { name: 'Complain', value: 2 },
    { name: 'Announcement', value: 3 }
  ];
  public getFeedbackData: any;

  constructor(private router: Router, private apiService: ApiService,
    private api: CommonService,
    private sweetlalert: SweetalertService) { }

  async ngOnInit() {
    this.loading = true
    this.getFeedbackData = await this.apiService.getUserSuggestion();
    this.loading = false
    this.dataSource.data = this.getFeedbackData
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addsuggestionsdetails() {
    this.router.navigate(['feedback-suggestions/Addsuggestion'])
  }

  async deletefeedback(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Suggestion/${element.id}`).subscribe((res) => {
        if (res.statusCode == 200) {
          this.apiService.showToast('Feedback-suggestion has been deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getFeedbackData = this.getFeedbackData.filter(item => item.id !== element.id);
          this.applyFilter();
        } else if (res.statusCode != 200) {
          this.apiService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR);
        }
      }, (error) => {
        this.api.showToast(error?.error?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR);
      });
    }
  }

  convertStatus(value) {
    const status = ['Open', 'Close'];
    let list = status.filter((item, index) => index == value);
    return list;
  }

  convertSuggestionType(value) {
    const type = ['Suggestion', 'Feedback', 'Complain', 'Announcement'];
    let list = type.filter((item, index) => index == value);
    return list;
  }

  selectSuggestionType(type: { name: any, value: any } | null): void {
    this.selectedSuggestionType = type ? type.value : null;
    this.applyFilter();
  }

  applyFilter(): void {
    let filteredData = this.getFeedbackData;
    if (this.selectedSuggestionType !== null) {
      filteredData = filteredData.filter(item => item.suggestionType === this.selectedSuggestionType);
    }
    this.dataSource.data = filteredData;
  }

}
