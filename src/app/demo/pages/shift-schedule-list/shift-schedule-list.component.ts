import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { userRole } from 'src/app/assets.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';

export enum ShiftSchedule {
  name = 'name',
  minStartTime = 'minStartTime',
  startTime = 'startTime',
  maxStartTime = 'maxStartTime',
  minEndTime = 'minEndTime',
  endTime = 'endTime',
  maxEndTime = 'maxEndTime', 
  actions = 'actions',
}

@Component({
  selector: 'app-shift-schedule-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, RouterModule],
  templateUrl: './shift-schedule-list.component.html',
  styleUrls: ['./shift-schedule-list.component.scss']
})
export class ShiftScheduleListComponent implements OnInit {

  public userRole: Array<userRole> = [];
  loading:boolean = false;
  displayedColumns: string[] = Object.values(ShiftSchedule);
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    public dialog: MatDialog,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Loan";
      })
    }
    this.getAllShiftScheduleData();
  }

  getAllShiftScheduleData() {
    this.loading = true;
    this._commonService.get(`shift`).subscribe(res => {
      this.loading = false
      this.dataSource = new MatTableDataSource<any>(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  addShiftSchedule() {
    this.router.navigate([`shift-schedule/shift-schedule-form`]);
  }

  editShiftSchedule(id: any) {
    this.router.navigate([`shift-schedule/shift-schedule-form/${id}`]);
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Shift/${element}`).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.getAllShiftScheduleData();
        this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data;
    }
  }

}
