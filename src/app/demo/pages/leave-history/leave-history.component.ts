import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { userRole } from 'src/app/assets.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { Designation } from 'src/app/service/common/common.model';
export enum LeaveStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  cancelled = 3,
  UnPaid = 4
}

export enum Duration {
  FirstHalf = 0,
  SecondHalf = 1,
  FullDay = 2
}

export const LeaveStatusLable = {
  [LeaveStatus.Pending]: 'Pending',
  [LeaveStatus.Approved]: 'Approved',
  [LeaveStatus.Rejected]: 'Rejected',
  [LeaveStatus.cancelled]: 'cancelled',
  [LeaveStatus.UnPaid]: 'UnPaid'
};

enum LeaveType {
  Leave = 0,
  WorkFromHome = 1,
  MaternityLeave = 2,
  PaternityLeave = 3,
  CompOff = 4
}

const LeaveTypeLable = {
  [LeaveType.Leave]: 'Leave',
  [LeaveType.WorkFromHome]: 'Work From Home',
  [LeaveType.MaternityLeave]: 'Maternity Leave',
  [LeaveType.PaternityLeave]: 'Paternity Leave',
  [LeaveType.CompOff]: 'Comp Off'
};
@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss']
})
export class LeaveHistoryComponent {
  selectedYear: any;
  years: any[] = [];
  designationId: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Ename', 'Leave', 'RequestDate', 'LeaveType', 'duration', 'Reason', 'Status', 'WFH', 'Remark'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  searchTerm: string = '';
  id: string;
  DepartmentName: any;
  DepartmentID: any;
  Designation: Array<Designation> = [];
  PersonName: any;
  PersonID: any;
  public allDepartment: any;
  public summaryRecords: any;
  attachmentURL: string = environment.apiUrl.replace('api/', '');
  dateFormat: string = localStorage.getItem('Date_Format');
  isCountDisplay: boolean = false;
  getAllEmplyeeList: any;
  PersonId: string = '';
  deptId: string = '';
  public tableData: Array<Designation> = [];
  loading: Boolean = false;
  constructor(
    public dialog: MatDialog,
    private api: CommonService,
    private _commonService: CommonService
  ) {}

  async ngOnInit() {
    this.DepartmentID = '';
    this.PersonID = '';
    this.setFinancialYears();
    this.getAllDepartment();
    this.getAllperson();
    this.onLeaveFilter();
  }

  setFinancialYears() {
    this.years = [];

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Months are 0-indexed

    // Determine default financial year
    let startYear: number;
    if (currentMonth >= 4) {
      startYear = currentYear;
    } else {
      startYear = currentYear - 1;
    }

    this.selectedYear = `${startYear}-${startYear + 1}`;

    for (let i = 0; i <= 5; i++) {
      const year = startYear - i;
      this.years.push(`${year}-${year + 1}`);
    }
  }

  onYearSelected(financialYear: string) {
    const selectedStartYear = parseInt(financialYear.split('-')[0]);
  }

  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this.api.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.PersonName = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });
  }

  getAllDepartment() {
    this.api.get(`Department`).subscribe((x) => {
      this.DepartmentName = x;
    });
  }

  getAllDesignation() {
    this.loading = true;
    this._commonService.get('Designation').subscribe((res) => {
      this.loading = false;
      this.tableData = res; 
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    });
  }
  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.PersonId = '';
    this.Designation = [];
    this.PersonName = [];
    this.getAllperson(this.deptId, '');

    if (!this.deptId) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res) => {
      this.Designation = res;
    });
  }

  //  When designation is selected → fetch persons/employees
  onDesignationChange() {
    this.PersonId = '';
    this.PersonName = [];

    this.getAllperson('', this.designationId);
  }
  @ViewChild(MatTable) table: MatTable<any>;

  onLeaveFilter() {
    this.PersonID = this.PersonID ?? '';
    this.PersonID ? (this.isCountDisplay = true) : '';
    this.api
      .get(`EmployeeLeave/GetEmployeeLeavesByFinancialYear?personId=${this.PersonID}&year=${this.selectedYear}`)
      .subscribe((response) => {
        this.summaryRecords = response[0]?.summary ?? [];

        const allLeaves = response.length ? response.flatMap((entry) => entry.leaves) : [];

        this.dataSource = new MatTableDataSource([]); // clear old data
        this.dataSource = new MatTableDataSource(allLeaves); // set new

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }, 1000);
        this.table.renderRows(); // force refresh
      });
  }

  onReset() {
    this.isCountDisplay = false;
    this.deptId = '';
    this.designationId = '';
    this.PersonID = '';
    this.setFinancialYears();
    this.onLeaveFilter();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: any) {
    const filterValue = event.value.trim().toLowerCase();
    this.searchTerm = filterValue;
    const customFilter = (data: any, filter: string): boolean => {
      return (
        data.person?.firstName.toLowerCase().includes(filter) ||
        this.getStatusLabel(data.approval).toLowerCase().includes(filter) ||
        data.reason.toLowerCase().includes(filter) ||
        this.getLeavetypeLable(data.leaveType).toLocaleLowerCase().includes(filter)
      );
    };
    this.dataSource.filterPredicate = customFilter;
    this.dataSource.filter = filterValue;
    if (this.dataSource.filteredData.length === 0) {
    }
  }
  getStatusLabel(status: number): string {
    return LeaveStatusLable[status] || 'Unknown';
  }
  getLeavetypeLable(status: number): string {
    return LeaveTypeLable[status] || 'Unknown';
  }
  getDurationLable(startHalf: any, endHalf: any): any {
    if (startHalf === 0 && endHalf === 0) {
      return 'First Half';
    } else if (startHalf === 1 && endHalf === 1) {
      return 'Second Half';
    } else if (startHalf === 0 && endHalf === 1) {
      return 'Full Day';
    } else {
      return '-';
    }
  }

  getHalfLabel(half: number): string {
    if (half === 0) return 'First Half'; 
    if (half === 1) return 'Second Half'; 
    return '-';
  }
}
