import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { ToastType } from 'src/app/demo/models/models';
import { userRole } from 'src/app/assets.model';

@Component({
  selector: 'app-attendance-log',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './attendance-log.component.html',
  styleUrls: ['./attendance-log.component.scss']
})
export class AttendanceLogComponent {

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = ["Time", "ipAddress", "action"]
  public userRole: Array<userRole> = [];
  canDelete: boolean = false;
  public InOutTime: any;

  constructor(
    public dialogRef: MatDialogRef<AttendanceLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: any, data: any, date: any },
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    private datePipe: DatePipe) {
    this.dataSource = new MatTableDataSource(data?.data ?? []);
    this.displayedColumns = !this.canDelete ? ["Time", "ipAddress", "action"] : ["Time", "ipAddress"]
  }

  ngOnInit() {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    this.canDelete = userPermissions?.personRole == 'Admin';
  }  
getViewAttendance() {
  const personId = this.data?.id;
  const date = this.data?.date ?? new Date().toISOString().split('T')[0];

  if (!personId || !date) return;

  this._commonService.get(`AttendanceDetails/AttendanceDetails?personId=${personId}&date=${date}`)
    .subscribe((response) => {
      if (response?.length >= 0) {
        this.dataSource = new MatTableDataSource(response); // full refresh
      }
    });
}

async deleteBtn(element) {
  this.sweetlalert.deleteBtn();
  const confirmed = await this.sweetlalert.showDeleteConfirmation();

  if (confirmed) {
    this._commonService.delete(`AttendanceDetails/${element.id}`).subscribe(res => {
      if (res?.statusCode == 200) {
        this._commonService.showToast('Attendance deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);

        // Remove the deleted item from the table manually
        const data = this.dataSource.data;
        const index = data.findIndex(item => item.id === element.id);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSource.data = [...data]; // trigger change detection
        }

      } else if (res?.statusCode == 400) {
        this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR);
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR);
    });
  }
} 
}
