import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-shift-schedule-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule, MatCardModule],
  templateUrl: './shift-schedule-form.component.html',
  styleUrls: ['./shift-schedule-form.component.scss']
})
export class ShiftScheduleFormComponent implements OnInit{

  shiftForm: FormGroup;
  shiftId: string = '';
  selectedTime: string;
  isSubmitting : boolean = false

  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private _commonService: CommonService) {
    this.shiftForm = this.buildForm();
  }

  buildForm() {
    return this._fb.group({
      name : ['', [Validators.required]],
      minStartTime : ['08:00', [Validators.required]],
      startTime : ['09:00', [Validators.required]],
      maxStartTime : ['10:00', [Validators.required]],
      minEndTime : ['05:00', [Validators.required]],
      endTime : ['06:00', [Validators.required]],
      maxEndTime : ['07:00', [Validators.required]],
      isRotation : ['', ],
    })
  }
  public get getShiftFormControl() {
    return this.shiftForm.controls;
  }

  ngOnInit() {
    this.getShiftById();
  }

  onTimeChange(newTime: any) {
    this.selectedTime = newTime;
  }

  getShiftById() {
    this.shiftId = this.activeRoute?.snapshot?.params['id'];
    if (this.shiftId) {
      this._commonService.get(`shift/${this.shiftId}`).subscribe( res => {
        this.shiftForm.patchValue(res);
      })
    }
  }

  addShift() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.shiftForm.invalid) {
      this.shiftForm.markAllAsTouched();
      return;
    }

    let payload = { ...this.shiftForm.value, id: this.shiftId };

    if (this.shiftId) {
      this._commonService.put(`shift`, payload).subscribe(res => {
        this._commonService.showToast('Shift Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.shiftForm.reset();
        this.router.navigate(['shift-schedule']);

      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      })
    }
    else {
      this._commonService.post(`shift`, this.shiftForm.value).subscribe(res => {
        this._commonService.showToast('Shift Added Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.shiftForm.reset();
        this.router.navigate(['shift-schedule']);

      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      })
    }
  }
  trimNameOnBlur(controlName: string) {
    const control = this.shiftForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
  onList() {
    this.router.navigate(['shift-schedule']);
  }
}
