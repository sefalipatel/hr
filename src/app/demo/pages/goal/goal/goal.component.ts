import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../role-list/sweetalert.service';

@Component({
  selector: 'app-goal',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, MatTableModule],
  templateUrl: './goal.component.html',
  styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  public userRole: any;
  public userGoalTypeRole: any;
  goalList: any;
  isForm?: boolean = false;
  dateFormat: string = localStorage.getItem('Date_Format');
  displayedColumns = ["goalType", "subject", "startDate", "endDate", "description", "status", "action"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading : boolean = false;

  constructor(private _commonService: CommonService, private route: ActivatedRoute, private router: Router, private sweetlalert: SweetalertService) { }

  ngOnInit(): void {
    this.getAllGoal();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Goal";
      })
      this.userGoalTypeRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "GoalType";
      })

    }
  }

  getAllGoal() {
    this.loading = true
    this._commonService.get(`Goal/GetAllGoalByPersonId`).subscribe(res => {
      this.loading = false
      this.goalList = res;
      this.dataSource = new MatTableDataSource<any>(this.goalList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  getListValue(id: string) {
    this.router.navigate([`goal/add/${id}`]);
  }

  goalType() {
    this.isForm = true
  }


  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Goal/${id}`).subscribe(res => {
        if (res == true) {
          this._commonService.showToast('Goal deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllGoal();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }


}
