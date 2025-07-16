import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-shift-schedule-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatSelectModule],
  templateUrl: './user-shift-schedule-form.component.html',
  styleUrls: ['./user-shift-schedule-form.component.scss']
})
export class UserShiftScheduleFormComponent implements OnInit, OnDestroy {
  public userShiftScheduleForm: FormGroup;
  public getAllEmployeeList: any;
  public shiftList: any;
  public userShiftId: string;
  public getShiftIdData: any;
  public userId: string
  public selectedShiftIds: any;
  public selectedPersonId: any;
  id: string = '';

  constructor(private commonService: CommonService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute, 
    private route: ActivatedRoute) {
    this.userShiftScheduleForm = this.buildForm();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getAllEmployeePerson();
    this.getShift();
    this.route.params.subscribe(async (params) => {
      this.userShiftId = this.userShiftId ?? params['id']
    })
    this.getShiftDataById();
    this.selectedShiftIds = JSON.parse(localStorage.getItem("selectedShiftIds"));
    this.selectedPersonId = JSON.parse(localStorage.getItem("selectedPersonId"))
  }

  ngOnDestroy(): void {
    localStorage.removeItem("selectedShiftIds");
  }

  buildForm() {
    return this.formBuilder.group({
      userId: [[], Validators.required],
      shiftId: ['', Validators.required]
    })
  }

  // get all employee person
  getAllEmployeePerson() {
    this.commonService.get('Person/listemployee').subscribe(res => {
      this.getAllEmployeeList = res;
      this.getAllEmployeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
      if (this.selectedShiftIds?.length) {
        this.userShiftScheduleForm.get('userId').setValue(this.selectedShiftIds);
        this.userShiftScheduleForm.get('userId').disable();
      }
    })
  }

  // get all employee person
  getShift() {
    this.commonService.get('Shift').subscribe(res => {
      this.shiftList = res;
    })
  }

  onSubmit() {
    if (this.userShiftScheduleForm.invalid) {
      this.userShiftScheduleForm.markAllAsTouched();
      return;
    }
    let payload = {
      userId: this.userShiftScheduleForm.get('userId').value,
      ...this.userShiftScheduleForm.value
    }
    this.commonService.post('Shift/AddUpdateUserShift', payload).subscribe(res => {
      if (res) {
        this.onList();
        this.userShiftScheduleForm.reset();
      }
    })
  }

  // get by ID for edit data
  getShiftDataById() {
    this.commonService.get(`Shift/${this.userShiftId}`).subscribe(res => {
      if (res) {
        this.userShiftScheduleForm.patchValue({
          shiftId: res?.id,
        })
      }
      if (this.selectedPersonId?.length) {
        this.userShiftScheduleForm.get('userId').setValue([this.selectedPersonId]);
        this.userShiftScheduleForm.get('userId').disable();
      }
    })
  }

  onList() {
    this.router.navigate(['user-shift-schedule/detail']);
  }

}
