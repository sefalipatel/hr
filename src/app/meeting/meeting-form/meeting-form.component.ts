import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { constants } from 'buffer';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';

enum ExpenseStatus {
  Paid = 0,
  UnPaid = 1,
}
@Component({
  selector: 'app-meeting-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, MaterialModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.scss']
})
export class MeetingFormComponent implements OnInit {
  public meetingRoomForm: FormGroup;
  public imageFileOnly: string;
  imageUrl: string = environment.apiUrl.replace('api/', '')
  isSubmmitted: boolean = false;
  isActive: boolean;
  id: string = '';
  @ViewChild('logoUploader') logoUploader!: ElementRef;

  requestId: any;

  constructor(private formBuilder: FormBuilder, private api: CommonService,
    private route: ActivatedRoute, private router: Router, private activeRoute: ActivatedRoute, private _commonService: CommonService, private datePipe: DatePipe, private sweetlalert: SweetalertService) {
    this.meetingRoomForm = this.buildForm();
    this.imageFileOnly = this._commonService.imageFileOnly;
    this.isSubmmitted = false;
  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    if (this.requestId) {
      this.getAllMeeting();
    }
  }

  buildForm() {
    return this.formBuilder.group({
      name: ["", [Validators.required]],
      capacity: ["", [Validators.required, Validators.pattern(`^[0-9]+(-[0-9]+)?$`)]],
      amenities: ["", [Validators.required]],
      isActive: [true]
    })
  }

  get meetingRoomFormControl() {
    return this.meetingRoomForm.controls;
  }

  getAllMeeting() {
    let id = localStorage.getItem('id');
    this.api.get(`MeetingRoom/${this.requestId}`).subscribe((res) => {
      this.meetingRoomForm.patchValue(res?.value);
    })
  }
  async switchToggle(id: string, isActive: boolean) {
    const confirmed = await this.sweetlalert.activeStatusConfirmation();
    if (confirmed) {
      this.api.put(`MeetingRoom/${id}/active/${!isActive}`, '').subscribe(res => {
        if (res) {
          this.api.showToast('MeetingRoom has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllMeeting();
        }
      })
    } else {
      this.getAllMeeting();
    }
  }
  addMeeting() {
    if (this.meetingRoomForm.invalid) {
      this.isSubmmitted = true;
      this.meetingRoomForm.markAllAsTouched();
      return;
    }
    if (this.requestId) {
      let payload =
      {
        id: this.requestId,
        ...this.meetingRoomForm.value,
        organizationsId: (localStorage.getItem('orgId'))
      }
      payload.isActive = this.meetingRoomForm.value.isActive == null ? null : this.meetingRoomForm.value.isActive == true;
      this._commonService.put(`MeetingRoom`, payload).subscribe(res => {
        if (res) {
          this.api.showToast('Meeting room status has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllMeeting()
          this.router.navigate(['meeting-room/details']);
        }
      })
    } else {
      this._commonService.post('MeetingRoom', this.meetingRoomForm.value).subscribe(res => {
        if (res) {
          this.api.showToast('Meeting room has been added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.router.navigate(['meeting-room/details']);
        }
      }, (err) => {
      })
    }
    this.meetingRoomForm.reset();
  }
  
  trimOnBlur(field: string) {
    const control = this.meetingRoomForm.get(field);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  
  onList() {
    this.router.navigate(['meeting-room/details']);
  }
}




