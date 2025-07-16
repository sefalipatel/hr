import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-dashboard-user-warning',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule],
  templateUrl: './dashboard-user-warning.component.html',
  styleUrls: ['./dashboard-user-warning.component.scss']
})
export class DashboardUserWarningComponent implements OnInit {
  public getAllUserWarning: any;
  displayedColumns = ["companyPolicy", "warning", "warnedBy", "warningDate"];
  dataSource = new MatTableDataSource<any>();
  loading : boolean =false
  constructor(private commonservice: CommonService) { }

  ngOnInit(): void {
    this.getAllWarning();
  }

  getAllWarning() {
    this.loading = true
    this.commonservice.get('Warning/GetWarningByEmployee').subscribe(res => {
      this.loading = false
      this.getAllUserWarning = res?.value;
      this.dataSource = new MatTableDataSource<any>(this.getAllUserWarning);
    })
  }
}
