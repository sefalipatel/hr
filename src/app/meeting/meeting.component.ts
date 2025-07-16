// import { Component } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userRole } from 'src/app/assets.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastType } from 'src/app/service/common/common.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SweetalertService } from '../demo/pages/role-list/sweetalert.service';

enum ExpenseEnum {
  name = "name",
  capacity = "capacity",
  amenities = "amenities",
  isActive = "isActive",
  Actions = 'actions',
}
@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, SharedModule],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnInit{
  MeetingRoom: any;
  public roomdata: any;
  public sortConfig!: Sort
  dataSource = new MatTableDataSource<any>()
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public userRole: Array<userRole> = [];
  loading: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private api: CommonService,
    private sweetlalert: SweetalertService) {
    this.displayedColumns = Object.values(ExpenseEnum);
  }

  ngOnInit() {
    this.getMeeting();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMeeting() {
    this.loading = true;
    this.api.get(`MeetingRoom`).subscribe((response) => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.roomdata = this.dataSource.data.filter((x: any) => !x.id);
    })
  }

  async switchToggle(id: string, isActive: boolean) {
    const confirmed = await this.sweetlalert.activeStatusConfirmation();
    if (confirmed) {
      this.api.put(`MeetingRoom/${id}/active/${!isActive}`, '').subscribe(res => {
        if (res) {
          this.api.showToast('MeetingRoom has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getMeeting();
        }
      })
    } else {
      this.getMeeting();
    }
  }

  async deleteMeeting(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`MeetingRoom/${element.id}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.api.showToast('MeetingRoom deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (res?.statusCode == 400 || !res) {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  editMeeting(element) {
    this.router.navigate([`meeting-room/form/${element.id}`])
  }

  addMeeting() {
    this.router.navigate(['meeting-room/form']);
  }
  public sortData(sort: Sort) {
    this.sortConfig = sort;
    return;
  }

  async delete(id: string) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`MeetingRoom/DeleteMeetingRoom/${id}`).subscribe(res => {
        if (res == true) {
          this.api.showToast('Meeting room deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getMeeting();
        } else {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
}
