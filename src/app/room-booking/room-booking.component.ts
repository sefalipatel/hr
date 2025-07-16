import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { assetsAssignment } from 'src/app/assets.model';
import { CommonService } from 'src/app/service/common/common.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CalendarOptions } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list'
import { ToastType } from 'src/app/service/common/common.model';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

enum ExpenseEnum {
  name = "name",
  capacity = "capacity",
  amenities = "amenities",
}

enum Designation {
  name = "name",
  capacity = "capacity",
  amenities = "amenities",
}

export type Appointment = {
  id?: string;
  start?: Date;
  end?: Date;
  reason?: string;
  allDay?: boolean;
  firstName?: string
}
@Component({
  selector: 'app-room-booking',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule, MatCheckboxModule,
    MatTabsModule, MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.scss']
})
export class RoomBookingComponent implements OnInit, AfterViewInit{
  options = {};
  events = [];
  invitationForm: FormGroup;
  public expenseDetail: any;
  indatetime: any
  selectedTime: string;
  outTime: any
  public expenseId: string;
  currentDate = new Date();
  public roomdata: any;
  calendarOption: CalendarOptions;
  selectedDate: string;
  dataSource = new MatTableDataSource<any>()
  displayedColumns: string[] = [];
  isChecked: boolean = false;
  Person: Array<assetsAssignment> = [];
  roomId: any;
  selectedRoomId = new FormControl('', [Validators.required]);
  isSubmmitted: boolean = false;
  roomvalue: any;
  person: any;
  @Input() isNew: boolean;
  public tableData: Array<Designation> = [];
  calendarComponent: any;
  bookingId: any;
  minDate: string;
  selectedInterval = '15';
  @ViewChild('roomFormToggle', { static: true }) roomFormToggle: ElementRef;
  updataid: any = null;
  personID = JSON.parse(localStorage.getItem('userInfo')).personID;
  selectedPerson: string = ''
  selectedStartDate
  selectedEndDate

  constructor(private _formBuilder: FormBuilder, private api: CommonService, private datePipe: DatePipe,private renderer: Renderer2, private el: ElementRef) {
    this.invitationForm = this.initForm();
    this.displayedColumns = Object.values(ExpenseEnum);

    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      eventClick: (event: any) => {
        this.bookingId = event.event['_def'].publicId
        this.bookingDetailById(this.bookingId)
      },
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventColor: 'purple',
    };
    let defaultCheckInTime = new Date().getMinutes() > 30 ? (new Date().getHours() + 1 + ':' + '00') : (new Date().getHours()) + ':' + '30'
    let defaultCheckOutTime = new Date().getMinutes() > 30 ? (new Date().getHours() + 1 + ':' + '30') : (new Date().getHours() + 1) + ':' + '00'
    this.f['recurringStartDate'].setValue(defaultCheckInTime)
    this.f['recurringEndDate'].setValue(defaultCheckOutTime)
    const currentDate = new Date();
    this.minDate = new Date().toISOString().slice(0, 16);
  }

  ngAfterViewInit() {
    this.capitalizeButtonTitles();
  }

  capitalizeButtonTitles() {
    const buttons = document.querySelectorAll('.fc-button-group .fc-button, .fc-button');
    buttons.forEach((button) => {
      const title = button.getAttribute('title');
      if (title) {
        const capitalizedTitle = title.replace(/\b\w/g, char => char.toUpperCase());
        button.setAttribute('title', capitalizedTitle);
      }
    });
  }
  @ViewChildren(MatTooltip) tooltips: QueryList<MatTooltip>;
  capitalizeTooltipTexts() {
    const buttons = document.querySelectorAll('.fc-button-group .fc-button');

    setTimeout(() => {
      this.tooltips.forEach((tooltip: MatTooltip) => {
        // Access the tooltip's host element
        const tooltipElement = tooltip._tooltipInstance._tooltip.nativeElement  as HTMLElement;
        const title = tooltipElement.getAttribute('matTooltip');

        if (title) {
          // Capitalize only the first letter of each word
          const capitalizedTitle = title.replace(/\b\w/g, char => char.toUpperCase());
          this.renderer.setAttribute(tooltipElement, 'matTooltip', capitalizedTitle);
        }
      });
    }, 0);
  }
  get invitationFormControl() {
    return this.invitationForm.controls;
  }
  calendardata(data: any) {
    const events = [];
    data?.map((x, i) => {
      if (x.startTime) {
        x.startDate = new Date(x.startDate).setMinutes(x.startTime?.toString().split(':')[1])
        x.startDate = (new Date(x.startDate).setHours(x.startTime?.toString().split(':')[0]))
        x.startDate = new Date(x.startDate)
      }
      if (x.endTime) {
        x.endDate = new Date(x.endDate).setMinutes(x.startTime?.toString().split(':')[1])
        x.endDate = (new Date(x.endDate).setHours(x.startTime?.toString().split(':')[0]))
        x.endDate = new Date(x.endDate)
      }
      events.push({
        title: `${x.reason}`,
        start: new Date(x.startDate),
        end: new Date(x.endDate),
        id: x.id,
        color: x.personId == this.personID ? '#52c41a' : '#ff4d4f',
      });
    })
    this.options = {
      ...this.options, ...{ events: events },
    };
  }

  getStep(): number {
    return parseInt(this.selectedInterval, 10);
  }
  initForm() {
    return this._formBuilder.group({
      reason: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      recurringStartDate: ['',],
      isRecurring: [false],
      recurringEndDate: ['',],
      firstName: ['']
    })
  }
  ngOnInit() {
    this.calendarOption = {
      initialView: 'dayGridMonth',
      dateClick: this.handleDateClick.bind(this)
    };
    this.getAllRoombook(),
      this.api.get(`MeetingRoom`).subscribe((response) => {
        this.Person = response.filter(x => x.isActive)
      })
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
  }

  roomid(data) {
    this.roomId = data.value;
    if (this.roomId) {
      this.api.get(`RoomBooking/GetAllRoomBookingListByMeetingRoomId?meetingRoomId=${this.roomId}`).subscribe((res) => {
        this.calendardata(res?.value)
      })
    } else {
      this.getAllRoombook();
    }
  }

  get f() {
    return this.invitationForm.controls;
  }
  SelfBooking(type: string) {
    this.roomdata = this.tableData.filter((x: any) => type == 'self' ? x.personId == this.personID : x.personId != this.personID);
    this.dataSource.data = this.roomdata;
    this.calendardata(this.roomdata);
  }

  onInTimeChange(value: any, controlName: string) {
    this.indatetime = value?.target?.value;
    var dt = new Date(this.indatetime);
    const newdate = dt.setUTCMinutes(dt.getUTCMinutes() + 30);
    const formattedDate = this.datePipe.transform(new Date(newdate), 'yyyy-MM-ddTHH:mm:ss');
    this.f[controlName].setValue(formattedDate)
  }
  onOutTimeChange(value: any) {
    this.outTime = value?.target?.value;
  }
  isTimeInvalid() {
    return this.indatetime && this.outTime && this.indatetime > this.outTime ? true : false;
  }
  addRoom() {
    if (this.invitationForm.invalid) {
      this.isSubmmitted = true;
      this.invitationForm.markAllAsTouched();
      return;
    }
    const formattedDate = this.datePipe.transform(this.invitationForm.value.expenseDate, 'yyyy-MM-ddTHH:mm:ss');
    this.invitationForm.patchValue({ expenseDate: formattedDate });
    let keys = Object.keys(this.invitationForm.value)
    let formData = new FormData();
    keys.map(x => {
      if (this.invitationForm.value[x]) {
        formData.append(x, this.invitationForm.value[x])
      }
    })
    const starttime = this.datePipe.transform(this.invitationForm.value.startDate, "H:mm")
    const endtime = this.datePipe.transform(this.invitationForm.value.endDate, "H:mm")
    const startDate = this.datePipe.transform(this.invitationForm.value.startDate, "YYYY-MM-dd")
    const endDate = this.datePipe.transform(this.invitationForm.value.endDate, "YYYY-MM-dd")
    let payload = {
      MeetingRoomId: this.roomId,
      ...this.invitationForm.value,
      StartTime: starttime,
      EndTime: endtime,
      endDate: endDate,
      startDate: startDate,
      isRecurring: this.invitationForm.value.isRecurring ?? false,
      PersonId: this.personID
    }

    if (this.updataid) {
      payload = {
        ...payload,
        Id: this.bookingId
      }
      this.api.put(`RoomBooking`, payload).subscribe(res => {
        if (res) {
          this.roomFormToggle.nativeElement.click();
          this.api.showToast('Room Booking Updated Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.invitationForm.reset();
          this.roomId ? this.roomid({ value: this.roomId }) : this.getAllRoombook()
        }
      }, (err => {
        this.api.showToast(err?.error ?? 'Something Went Wrong!', ToastType.ERROR, ToastType.ERROR)
      }))
    } else {
      this.api.post('RoomBooking', payload).subscribe(res => {
        if (res) {
          this.roomFormToggle.nativeElement.click();
          this.roomId ? this.roomid({ value: this.roomId }) : this.getAllRoombook()
          this.api.showToast('Room Booking Added Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
          this.invitationForm.reset();
        }
      }, (err) => {
        this.api.showToast(err?.error ?? 'Something Went Wrong!', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  public randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAllRoombook() {
    this.api.get('RoomBooking').subscribe(res => {
      this.tableData = res;
      this.dataSource = new MatTableDataSource<Designation>(this.tableData);
      this.calendardata(res)
    })
  }
  RoomDelete() {
    this.api.delete(`RoomBooking/${this.bookingId}`).subscribe((x) => {
      if (x.statusCode == 200) {
        this.api.showToast(x.value, ToastType.SUCCESS, ToastType.SUCCESS)
        this.roomFormToggle.nativeElement.click(); 
        this.roomId ? this.roomid({ value: this.roomId }) : this.getAllRoombook
      }
    })
  }

  bookingDetailById(id: string) {
    this.api.get(`RoomBooking/${id}`).subscribe((res) => {
      this.selectedPerson = res.value.personId;
      this.invitationForm.enable();
      if (this.selectedPerson != this.personID)
        this.invitationForm.disable();
      this.roomFormToggle.nativeElement.click();
      this.updataid = res.value.id;
      this.roomvalue = res.value;
      this.person = res.value;
      this.invitationForm.reset()
      if (res.value.startTime) {
        res.value.startDate = new Date(res.value.startDate).setMinutes(res.value.startTime?.toString().split(':')[1])
        res.value.startDate = (new Date(res.value.startDate).setHours(res.value.startTime?.toString().split(':')[0]))
        res.value.startDate = this.datePipe.transform(new Date(res.value.startDate), 'yyyy-MM-ddTHH:mm:ss');
      }
      if (res.value.endTime) {
        res.value.endDate = new Date(res.value.endDate).setMinutes(res.value.endTime?.toString().split(':')[1])
        res.value.endDate = (new Date(res.value.endDate).setHours(res.value.endTime?.toString().split(':')[0]))
        res.value.endDate = this.datePipe.transform(new Date(res.value.endDate), 'yyyy-MM-ddTHH:mm:ss');
      }
      this.selectedStartDate = new Date(res.value.startDate)
      this.selectedEndDate = new Date(res.value.endDate)
      if (this.selectedStartDate < this.currentDate && this.selectedEndDate < this.currentDate)
        this.invitationForm.disable();
      this.invitationForm.patchValue(res.value);
    })
  }

  roomdetails() {
    if (this.roomId) {
      this.invitationForm.reset()
      if (!this.bookingId) {
        this.selectedPerson = ''
        this.invitationForm.enable()
      }
      this.roomvalue = this.Person?.find(x => x.id == this.roomId)
    } else {
      this.selectedRoomId.markAsTouched()
    }
  }
  cancel() {
    this.roomFormToggle.nativeElement.click();
  }

  addBooking() {
    this.invitationForm.reset();
    this.invitationForm.enable();
    this.bookingId = '';
    this.selectedPerson = '';
    this.updataid = null;
    this.roomFormToggle.nativeElement.click()
  }
  aviodClick(event) {
    this.selectedRoomId.markAsTouched();
    event.stopPropagation();
  }

  trimNameOnBlur() {
    const control = this.invitationForm.get('reason');
    if (control?.value) {
      // Trim leading and trailing spaces only when the input loses focus
      const trimmedValue = control.value.trim();
      // Set the trimmed value back to the form control
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  
 
}
