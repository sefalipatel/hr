import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SweetalertService } from '../../../role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-time-sheet-date-wise',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule,DatePipe],
  templateUrl: './time-sheet-date-wise.component.html',
  styleUrls: ['./time-sheet-date-wise.component.scss']
})
export default class TimeSheetDateWiseComponent {

  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = ["Date", "Time","Comments", "action"]
  dateFormat: string = localStorage.getItem('Date_Format');

  constructor(
    public dialogRef: MatDialogRef<TimeSheetDateWiseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sweetlalert: SweetalertService,
    private api: CommonService,
 ) {
      this.dataSource = new MatTableDataSource(data?.data ?? []);
      this.displayedColumns = data?.isEmployee ? ["Date", "Time","Comments", "action"] : ["Date", "Time","Comments"];
  }


  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`TimesheetDetail/${id}`).subscribe((x) => {
        this.dataSource = new MatTableDataSource(this.data?.data?.filter (x => x.id !== id) ?? []);
        this.api.showToast('Data deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
      },
        (error) => {
          this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
        })
    }

  }
}
