import { CommonModule, DatePipe } from '@angular/common';
import { Component, Pipe, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';
import { error, log } from 'console';
import TimeSheetDateWiseComponent from '../time-sheet-admin/timeSheetDateWiseData/time-sheet-date-wise/time-sheet-date-wise.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../../../loader/loader.component';

export enum RegularizationReason {
  WorkFromHome = 0,
  WorkFromOffice = 1,
  ClientSide = 2
}
export const RegularizationReasonLabels = {
  ' Work  From  Home': '0',
  'Work  From  Office': '1',
  ClientSide: '2'
};

export enum TimeType {
  Project = 0,
  Training = 1
}
export const Timetypelable = {
  Project: '0',
  Training: '1'
};

@Component({
  selector: 'app-add-time-card',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    SharedModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatTooltipModule,
    LoaderComponent
  ],
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export default class AddNewCardComponent {
  regularizationReasonEnum: { value: number; key: string }[] = [
    { value: 0, key: 'Work From Home' },
    { value: 1, key: 'Work From office' },
    { value: 2, key: 'ClientSide' }
  ];
  timetypeEnum: { value: number; key: string }[] = [
    { value: 0, key: 'Project' },
    { value: 1, key: 'Training' }
  ];

  today: moment.Moment;
 
  timeCardForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  timeCardPeriod: string = '';
  showForm: boolean = false; 
  DateShow: { date: string; totalHours: number; comments: string }[] = [];
  showAllCards = false;
  totalHoursForAllEntries: string;
  startDate: string;
  loading: boolean = false;
  endDate: string;
  timesheetId: string; 
  startOfWeek: any;
  endOfWeek: any;
  employeeTimesheetId: string;
  currentDate: string;
  status: number;
  personId: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  displayedColumns: string[] = ['date', 'totalHours', 'comments', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  id: any;
  isSubmitting: boolean = false;
  currentweekTimeSheetId: any;
  maxCharacters = 500;
  charCountError: string = '';
  convertedTime: { hours: number; minutes: number };

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private api: CommonService,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService
  ) {
    this.minDate = moment().startOf('week').toDate();
    this.maxDate = new Date();

    let today = this.datePipe.transform(new Date(), 'M/d/yyyy');
    this.timeCardForm = this.fb.group({
      regulation: [, Validators.required],
      timesheetDate: [new Date(), Validators.required],
      timeType: [, Validators.required],
      totalHours: [, [Validators.required, , Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
      comments: ['', Validators.required],
      employeeTimesheetId: ''
    });
  }

  async ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.route.params.subscribe(async (params) => {
      this.timesheetId = params['id'];
    });
    this.today = moment();
    this.startOfWeek = this.getStartOfWeek(this.today);
    this.endOfWeek = this.getEndOfWeek(this.today);

    if (this.timesheetId) {
    } else {
      this.updateTimeCardPeriod(new Date());
      this.currentDate = moment(new Date()).format('DD-MM-YYYY');
    }
  }

  customDateValidator(control: FormControl) {
    const selectedDate = control.value;
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
    }
    return selectedDate;
  }

  async saveForm() {
    this.loading = true;
    const from = {
      EmployeeTimesheetId: this.employeeTimesheetId,
      PersonId: this.personId.personID,
      TimesheetStatus: 1
    };
    try {
      const response = await this.apiService.UpdateTimesheetStatus(from);
      if (response) {
        this.api.showToast('Timesheet saved successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.loading = false;
        this.router.navigate(['/home/existing-card']);
      }
    } catch {}
  }

  async approveButton() {
    const employeeTimesheetId = this.timeCardForm.get('employeeTimesheetId').value;
    const from = {
      EmployeeTimesheetId: employeeTimesheetId,
      PersonId: this.personId.personID,
      TimesheetStatus: 2
    };
    try {
      const response = await this.apiService.UpdateTimesheetStatus(from);
      if (response) {
        this.api.showToast('Timesheet submitted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.router.navigate(['/home/existing-card']);
      }
    } catch (error) {}
  }
  getStartOfWeek(date: moment.Moment): moment.Moment {
    return date.clone().startOf('isoWeek');
  }
  getEndOfWeek(date: moment.Moment): moment.Moment {
    return date.clone().endOf('isoWeek');
  }

  onInput() {
    let commentControl = this.timeCardForm.get('comments');

    if (commentControl?.value) {
      let charCount = commentControl.value.length;

      if (charCount > this.maxCharacters) {
        this.charCountError = `Comment must not exceed ${this.maxCharacters} characters. Current length: ${charCount}.`;
        // Trim the extra characters to enforce limit
        commentControl.setValue(commentControl.value.substring(0, this.maxCharacters));
      } else {
        this.charCountError = '';
      }
    }
  }
  submitForm() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    const formattedDate = this.datePipe.transform(this.timeCardForm.value.timesheetDate, 'yyyy-MM-dd');
    this.timeCardForm.patchValue({ timesheetDate: formattedDate });
 
    if (this.timeCardForm.valid) {
      if (this.id) {
        this.loading = true;
        this.timeCardForm.get('employeeTimesheetId').setValue(this.currentweekTimeSheetId);
        this.loading = false;
        let updatePayload = {
          id: this.id,
          ...this.timeCardForm.value
        };
        this.api.put(`TimesheetDetail`, updatePayload).subscribe((x) => {
          this.api.showToast('Timesheet update successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.loading = false;
          this.updateTimeCardPeriod(new Date());
          this.showForm = !this.showForm;
          this.isSubmitting = false;
          this.toggleForm();
          this.timeCardForm = this.fb.group({
            regulation: ['', Validators.required],
            timesheetDate: [new Date(), Validators.required],
            timeType: ['', Validators.required],
            totalHours: ['', [Validators.required, Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
            comments: ['', Validators.required],
            employeeTimesheetId: ''
          });
        });
        this.showAllCards = !this.showAllCards;
      } else {
        this.timeCardForm.get('employeeTimesheetId').setValue(this.currentweekTimeSheetId);
        this.api.post(`TimesheetDetail/AddTimesheetDetails/${this.personId.personID}`, this.timeCardForm.value).subscribe(
          (response) => {
            this.loading = false;
            if (response.statusCode == 200) {
              this.toastr.success('Timesheet Added Successfully', 'Success!');
              this.timeCardForm = this.fb.group({
                regulation: ['', Validators.required],
                timesheetDate: [new Date(), Validators.required],
                timeType: ['', Validators.required],
                totalHours: ['', [Validators.required, Validators.pattern(`/^(\d{0,2})(\.\d{0,2})?$/`)]],
                comments: ['', Validators.required],
                employeeTimesheetId: ''
              });
            }

            this.showForm = !this.showForm;
            this.updateTimeCardPeriod(new Date());
            this.isSubmitting = false;
          },
          (error) => {
            if (error?.response?.data?.errors[0]?.errorMessage) {
              this.toastr.error('error!', error?.response?.data?.errors[0]?.errorMessage);
            }
          }
        );
      }
    } else {
      this.timeCardForm.markAllAsTouched();
      this.isSubmitting = false;
    }
  }

  public timeSheetRecords: any[] = [];
  getAllTimeCard() {
    const startDate = this.datePipe.transform(this.startOfWeek, 'YYYY-MM-dd');
    const endDate = this.datePipe.transform(this.endOfWeek, 'YYYY-MM-dd');
    const personID = JSON.parse(localStorage.getItem('userInfo')).personID;

    this.api.get(`Timesheet/timeSheetDetails?startDate=${startDate}&userId=${personID}&endDate=${endDate}`).subscribe((x) => {
      this.timeSheetRecords = x;
    });
  }
  timesheetDateWiseData(element) {
    let dialogRef!: any;
    const timeSheetData = element.records;
    dialogRef = this.dialog.open(TimeSheetDateWiseComponent, {
      data: {
        data: timeSheetData,
        isEmployee: true
      }
    });
  }
  async updateTimeCardPeriod(selectedDate: Date | null) { 

    const selectedDateFormate = moment(selectedDate).format('DD-MM-YYYY');
    if (selectedDateFormate) {
      const response = await this.apiService.alltimeCardDeatils();

      if (response) {
        this.status = 1;
        this.DateShow = [];
        this.totalHoursForAllEntries = '0';
        const entries = response; 
        const selectedStartDate = moment(this.startOfWeek, 'DD-MM-YYYY');
        const selectedEndDate = moment(this.endOfWeek, 'DD-MM-YYYY');
        const filteredEntries = entries.filter((entry) => {
          const entryDate = moment(entry.startDate);
          const isInRange = entryDate.isBetween(selectedStartDate, selectedEndDate, null, '[]');

          if (isInRange) {
            const isSameDate = entryDate.date() === selectedStartDate.date();
            const isSameMonth = entryDate.month() === selectedStartDate.month();
            const isSameYear = entryDate.year() === selectedStartDate.year();
            return isSameDate && isSameMonth && isSameYear;
          }
          return false;
        });

        this.timeCardPeriod = `${this.datePipe.transform(this.startOfWeek, this.dateFormat)} - ${this.datePipe.transform(
          this.endOfWeek,
          this.dateFormat
        )}`;

        filteredEntries?.map((x) => {
          this.timeCardForm.get('employeeTimesheetId').setValue(x.employeeTimesheetId);
          this.currentweekTimeSheetId = x.employeeTimesheetId;
          const timesheetdatefilter = x.timesheetDetailList;
          this.DateShow = timesheetdatefilter.map((x) => {
            return {
              id: x.id,
              date: x.timesheetDate, // Format the date
              totalHours: x.totalHours, // Include total hours
              comments: x.comments // Include total hours
            };
          });
          this.dataSource.data = this.DateShow;
          this.dataSource.paginator = this.paginator;
          const TotalHours = x.totalHours;
          this.totalHoursForAllEntries = TotalHours;
          this.convertedTime = this.decimalToHoursMinutes(TotalHours); 
        });

        let uniqueArr = [];
        filteredEntries.map((obj1) => {
          obj1.timesheetDetailList.forEach((obj) => {
            if (uniqueArr?.length) {
              if (!uniqueArr?.some((x) => x.timesheetDate == obj.timesheetDate)) {
                uniqueArr.push({
                  timesheetDate: obj.timesheetDate,
                  totalHours: +obj.totalHours,
                  records: [obj]
                });
              } else {
                let findIndex = uniqueArr?.findIndex((x) => x.timesheetDate == obj.timesheetDate);
                uniqueArr[findIndex].totalHours += obj.totalHours;
                uniqueArr[findIndex].records.push(obj);
              }
            } else {
              uniqueArr.push({
                timesheetDate: obj.timesheetDate,
                totalHours: +obj.totalHours,
                records: [obj]
              });
            }
          });
        });
        this.timeSheetRecords = uniqueArr;
      }
    } else {
      this.timeCardPeriod = '';
    }
  }

  decimalToHoursMinutes(decimalHours?: number): { hours: number; minutes: number } {
    let hours = Math.floor(decimalHours);
    let minutes = Math.round((decimalHours - hours) * 60);
    if (minutes == 60) {
      hours += 1;
      minutes = 0;
    }
    return { hours, minutes };
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.timeCardForm = this.fb.group({
      regulation: ['', Validators.required],
      timesheetDate: [new Date(), Validators.required],
      timeType: ['', Validators.required],
      totalHours: ['', [Validators.required, Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
      comments: ['', Validators.required],
      employeeTimesheetId: ''
    });
  }

  onBtnClick() {
    this.router.navigate(['/home/existing-card']);
  }

  toggleShowAllCards() {
    this.showAllCards = !this.showAllCards;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  editTask(element) {
    this.showForm = true;
    this.api.get(`TimesheetDetail/${element.id}`).subscribe((x) => {
      this.timeCardForm.patchValue(x.value);
      this.timeCardForm.get('regulation').setValue(x.value.regulation);
      this.timeCardForm.get('timeType').setValue(x.value.regulation);
    });
    this.timesheetId = element.employeeTimesheetId;
    this.id = element.id;
  }
  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`TimesheetDetail/${id}`).subscribe(
        (x) => {
          this.updateTimeCardPeriod(new Date());

          this.dataSource.data = x;
          this.dataSource.paginator = this.paginator;
          this.api.showToast('Timesheet deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        },
        (error) => {
          this.api.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }
  trimNameOnBlur() {
    const control = this.timeCardForm.controls['comments'];
    if (control?.value) {
      // Trim leading and trailing spaces only when the input loses focus
      const trimmedValue = control.value.trim();
      // Set the trimmed value back to the form control
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  roundHours(value: number): string {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    return value.toFixed(2).replace(/\.?0+$/, '');
  }
  goBack() {
    this.router.navigate(['home/time-card']);
  }
}
export interface PeriodicElement {
  date: string;
  id?: string;
  comments: string;
  totalHours: number;
}
