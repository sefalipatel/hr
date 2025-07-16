import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatTooltipModule } from '@angular/material/tooltip';

export enum status {
  Open = 1,
  Close = 0
}
@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, MatTableModule, MatSortModule, MatPaginatorModule, MatTooltipModule],
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.scss']
})
export class PollDetailComponent implements OnInit {
  public getAllPollList: any;
  public departmentList: any;
  public selectedDepartment: string | null = null;
  displayedColumns = ["title", "vote", "createdBy", "createdOn", "department", "status", "approved", "action"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  public userRole: Array<userRole> = [];
  public dateFormat: string = localStorage.getItem('Date_Format');
  public pollStatus = status;
  loading : boolean = false
  constructor(private commonService: CommonService,
    private sweetlalert: SweetalertService,
    private router: Router) { }

  ngOnInit(): void {
    this.getPollDetails();
    this.getDepartment();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Employee";
      })
    }
  }

  // All poll list
  getPollDetails() {
    this.loading = true
    this.commonService.get('Poll').subscribe(res => {
      this.loading = false
      this.getAllPollList = res;
      this.dataSource = new MatTableDataSource<any>(this.getAllPollList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // Department list
  getDepartment() {
    this.commonService.get('Department').subscribe(res => {
      this.departmentList = res;
    })
  }

  selectDepartment(department: any) {
    this.selectedDepartment = department?.departmentName;
    this.applyFilter();
  }

  // Go to form on particular poll detail
  editPoll(id) {
    this.router.navigate([`add/poll-detail/${id}`]);
  }

  applyFilter(): void {
    const selectedDepartment = this.selectedDepartment ? this.selectedDepartment.trim().toLowerCase() : '';
    let filteredData = this.getAllPollList;
    // Filter department
    if (selectedDepartment) {
      filteredData = filteredData.filter(item => {
        return item.department?.toLowerCase() === selectedDepartment;
      });
    }
    this.dataSource.data = filteredData;
  }

  async delete(id: any) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.commonService.delete(`Poll/${id}`).subscribe(res => {
        if (res?.message === "Poll successfully deleted") {
          this.commonService.showToast('Poll deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getPollDetails();
        } else {
          this.commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  vote(id) {
    this.router.navigate([`vote-detail/${id}`]);
  }

  async showStatusConfirmation(event: Event, id: any) {
    const confirmed = await this.sweetlalert.showStatusConfirmation();

    const target = event.target as HTMLInputElement;
    const status = target.checked ? this.pollStatus.Open : this.pollStatus.Close;
    const originalChecked = !target.checked;

    if (confirmed) {
      this.commonService.put(`Poll/Status?pollId=${id}&status=${status}`, '').subscribe(res => {
        if (res) {
          this.commonService.showToast('Status changed successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getPollDetails();
        }
      }, (error) => {
        this.commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      (event.target as HTMLInputElement).checked = originalChecked;
    }
  }

  extractText(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Replace HTML line breaks and paragraph tags with newline characters
    return div.textContent || div.innerText || '';
  }

}
