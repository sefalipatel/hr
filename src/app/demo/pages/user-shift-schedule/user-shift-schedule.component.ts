import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { userRole } from 'src/app/assets.model';
import { CommonService } from 'src/app/service/common/common.service';
import { userShiftSchedule } from '../../models/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { take } from 'rxjs';

@Component({
  selector: 'app-user-shift-schedule',
  standalone: true,
  imports: [CommonModule, MatTableModule, SharedModule, MatCheckboxModule, FormsModule, MatPaginatorModule, MatSortModule],
  templateUrl: './user-shift-schedule.component.html',
  styleUrls: ['./user-shift-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserShiftScheduleComponent implements OnInit {
  public userRole: Array<userRole> = [];
  public searchDataValue: "";
  public departmentList: any;
  public isChecked: boolean = false;
  timeFormat: string = localStorage.getItem('Time_Format');
  public getShiftScheduleDetail: Array<userShiftSchedule> = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns = ['select', 'employeeCode', 'employeeName', 'department', 'shift', 'startTime', 'endtTime', 'action'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Loan";
      })
    }
    this.getShiftScheduleData();
    this.getAllDepartment();
  }

  addShiftSchedule() {
    if (this.isChecked) {
      let selectedIds = this.getShiftScheduleDetail.filter(x => x['isChecked'])?.map(item => item.personId)
      localStorage.setItem("selectedShiftIds", JSON.stringify(selectedIds))
    }
    this.router.navigate(["user-shift-schedule/add"]);
  }

  editShiftSchedule(id, personId) {
    if (personId) {
      localStorage.setItem("selectedPersonId", JSON.stringify(personId))
    }
    if (id?.length) {
      this.router.navigate([`user-shift-schedule/${id}`]);
    }
  }

  getShiftScheduleData() {
    this.commonService.get('shift/usershift').pipe(take(1)).subscribe(res => {
      this.getShiftScheduleDetail = res?.value?.map(item => {
        item['isChecked'] = false;
        return item;
      });

      this.dataSource = new MatTableDataSource<userShiftSchedule>(this.getShiftScheduleDetail);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
    })
  }

  // Department list
  getAllDepartment() {
    this.commonService.get('Department').subscribe(res => {
      this.departmentList = res;
    })
  }

  onChange() {
    this.isChecked = this.getShiftScheduleDetail?.some(x => x['isChecked']);
  }

  searchData(value: string) {
    if (value === "") {
      this.dataSource.data = this.getShiftScheduleDetail;
    } else {
      this.dataSource.data = this.getShiftScheduleDetail.filter((item) => {
        return item?.employeeName.toLowerCase().includes(value.toLowerCase()) ||
          item?.employeeCode.toLowerCase().includes(value.toLowerCase())
      })
    }
  }

  // Filter on department from the dropdown
  filterDepartment(selectedDepartment: string) {
    const filteredData = this.getShiftScheduleDetail.filter(item => item.departmentName.toLowerCase() === selectedDepartment.toLowerCase());
    this.dataSource.data = filteredData;
  }

  goToScheduleList() {
    this.router.navigate(['shift-schedule']);
  }

}
