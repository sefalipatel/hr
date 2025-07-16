import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import TimeSheetDateWiseComponent from './timeSheetDateWiseData/time-sheet-date-wise/time-sheet-date-wise.component';
import moment from 'moment';
import { Designation } from 'src/app/service/common/common.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-time-sheet-admin',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './time-sheet-admin.component.html',
  styleUrls: ['./time-sheet-admin.component.scss']
})
export default class TimeSheetAdminComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  DepartmentName: any;
  PersonName: any;
  PersonID: any;
  personId: string = '';
  designationId: string = '';
  public deptId: string = '';
  DepartmentID: any;
  alltimesheetDetails: any;
  loading: boolean = false;
  timeCardForm: FormGroup;
  firstDate = moment(moment().subtract(14, 'days').toDate()).format('YYYY-MM-DD');
  lastDate = moment(moment()).format('YYYY-MM-DD');
  displayedColumns: string[] = ['employeecode', 'name', 'date', 'totalHours', 'Action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  dateFormat: string = localStorage.getItem('Date_Format');
  Designation: Array<Designation> = []; 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private api: CommonService,
    private _commonService: CommonService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.timeCardForm = this.fb.group({
      firstDate: [this.firstDate, Validators.required],
      lastDate: [this.lastDate, Validators.required],
      DesignationId: [''],
      departmentId: [''],
      personId: ['']
    });
  }

  ngOnInit() {
    const currentDate = new Date();
    this.DepartmentID = '';
    this.PersonID = '';
    this.getAllDepartment();
    this.getAllperson();
    this.getAllTimeCard(); 
  }

  getAllDepartment() {
    this.api.get(`Department`).subscribe((x) => {
      this.DepartmentName = x;
    });
  }

  getAllperson(deptId?: string, designationId?: string) {
    deptId = deptId ?? '';
    designationId = designationId ?? '';
    this.api.get(`person/employees?departmentId=${deptId}&designationId=${designationId}`).subscribe((res: any[]) => {
      this.PersonName = res.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });
  }
  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.PersonID = '';
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
    this.PersonID = '';
    this.PersonName = []; 
    this.getAllperson('', this.designationId);
  }
  getAllTimeCard() {
    this.loading = true;
    const startDate = this.datePipe.transform(this.timeCardForm.value.firstDate, 'YYYY-MM-dd');
    const endDate = this.datePipe.transform(this.timeCardForm.value.lastDate, 'YYYY-MM-dd');
    this.PersonID = this.PersonID ?? '';

    // {{baseUrl}}/api/Timesheet/timeSheetDetails?startDate=2024-04-01&userId=DE5EC0B8-DA78-4F48-3CA0-08DB94B2361D&endDate=2024-04-15
    this.api.get(`Timesheet/timeSheetDetails?startDate=${startDate}&userId=${this.PersonID}&endDate=${endDate}`).subscribe((x) => {
      this.loading = false;
      this.alltimesheetDetails = x;
      this.dataSource.data = x;
      this.dataSource.sort = this.sort;
    });
  }
  timesheetDateWiseData(element) {
    let dialogRef!: any;
    const timeSheetData = element.timeSheetDetails;
    dialogRef = this.dialog.open(TimeSheetDateWiseComponent, {
      data: {
        data: timeSheetData
      }
    });
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'employeecode') {
        return item.personCode?.toLowerCase();
      }
      return item[property];
    };
  }
  
  Reset() {
    (this.DepartmentID = ''), (this.PersonID = '');
    this.deptId = '';
    this.designationId = '';
    this.PersonID = '';
    this.getAllTimeCard();
  }
}
export interface PeriodicElement {
  personName: any;
  personCode: any;
  date: string;
  comments: string;
  totalHours: string;
  name: string;
}
