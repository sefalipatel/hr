import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { userRole } from 'src/app/assets.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SweetalertService } from '../role-list/sweetalert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

enum StatusType {
  Inactive,
  Active
}
@Component({
  selector: 'app-goal-type',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, MatTableModule, MatPaginatorModule, MatSelectModule],
  templateUrl: './goal-type.component.html',
  styleUrls: ['./goal-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GoalTypeComponent {
  goalTypeForm: FormGroup
  dataSource = new MatTableDataSource<any>();
  public type: string;
  public isDisplay: boolean = false;
  goalTypeList: any;
  public userRole: Array<userRole> = [];
  displayedColumns = ["goalType", "status", "action"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public status = StatusType;
  goalTypeId: any;
  statusType = [
    { name: 'Inactive', id: false },
    { name: 'Active', id: true }
  ]


  constructor(private _commonService: CommonService, private formBuilder: FormBuilder, private sweetlalert: SweetalertService) {
    this.goalTypeForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getAllGoalType();
  }

  addGoalType() {
    this.isDisplay = true;
  }

  cancel() {
    this.isDisplay = false;
  }

  saveGoalType() {
    if (this.goalTypeForm.invalid) {
      this.goalTypeForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.goalTypeForm.value,
      type: this.goalTypeForm.value.type.trim() // Trim whitespace
    };

    if (this.goalTypeId) {
      this._commonService.put(`GoalType`, { id: this.goalTypeId, ...payload }).subscribe(res => {
        if (res) {
          this.getAllGoalType();
          this.isDisplay = false;
        }
      });
    } else {
      this._commonService.post(`GoalType`, payload).subscribe(res => {
        if (res) {
          this.getAllGoalType();
          this.isDisplay = false;
        }
      });
    }

    this.goalTypeForm.reset();
  }


  getAllGoalType() {
    this._commonService.get(`GoalType`).subscribe(res => {
      this.goalTypeList = res;
      this.dataSource = new MatTableDataSource<any>(this.goalTypeList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  getFormValue(id: string) {
    this._commonService.get(`GoalType/${id}`).subscribe(res => {
      this.goalTypeForm.patchValue(res); 
      const statusValue = res.status ? true : false;
      this.goalTypeForm.get('status').setValue(statusValue);
      this.isDisplay = true;
      this.goalTypeId = res.id;
    })
  }

  getStatusName(status: boolean) {
    const statusObject = this.statusType.find(item => item.id === status);
    return statusObject ? statusObject.name : '';
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`GoalType/${element.id}`).subscribe(res => {
        if (res == true) {
          this._commonService.showToast('Goal type deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllGoalType();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
}
