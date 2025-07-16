import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ToastType } from '../../models/models';
import TimeSheetDateWiseComponent from '../time-sheet-admin/timeSheetDateWiseData/time-sheet-date-wise/time-sheet-date-wise.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from "../../../loader/loader.component";

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
  templateUrl: './add-time-card.component.html',
  styleUrls: ['./add-time-card.component.scss']
})
export default class addtimecardcomponent {
  regularizationReasonEnum: { value: number, key: string }[] = [
    { value: 0, key: 'Work From Home' },
    { value: 1, key: 'Work From office' },
    { value: 2, key: 'ClientSide' }
  ]
  timetypeEnum: { value: number, key: string }[] = [
    { value: 0, key: 'Project' },
    { value: 1, key: 'Training' }
  ]
 
  timeCardForm: FormGroup;
  minDate: Date;
  maxDate: Date;
  timeCardPeriod: string = '';
  showForm: boolean = false; 
  DateShow: { date: string; totalHours: string, comments: string }[] = [];
  showAllCards = false;
  loading :boolean = false;
  totalHoursForAllEntries: string;
  startDate: string;
  endDate: string;
  timesheetId: string; 
  startOfWeek: string;
  endOfWeek: string;
  employeeTimesheetId: string;
  currentDate: string;
  current = new Date();
  status: number;
  personId: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  displayedColumns: string[] = ['date', 'totalHours', 'comments', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  id: any;
  convertedTime: { hours: number; minutes: number; };


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    private api: CommonService,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService,
  ) {
    this.minDate = moment().startOf('week').toDate();
    this.maxDate = new Date()

    this.timeCardForm = this.fb.group({
      regulation: ['', Validators.required],
      timesheetDate: [null, Validators.required],
      timeType: ['', Validators.required],
      totalHours: ['', [Validators.required, Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
      comments: ['', Validators.required],
      employeeTimesheetId: '',
      date: [new Date(), Validators.required],

    });

    this.timeCardForm.get('date').valueChanges.subscribe((selectedDate) => { 
      this.minDate = moment(selectedDate).startOf('week').toDate();
      this.maxDate = moment(selectedDate).endOf('week').toDate();
    });
  }
  async ngOnInit() {

    this.dataSource.data = this.DateShow
    this.personId = JSON.parse(localStorage.getItem('userInfo'));
    this.route.params.subscribe(async (params) => {
      this.timesheetId = params['id'];
    });
    this.timeCardForm.get('employeeTimesheetId').setValue(this.timesheetId);
    if (this.timesheetId) {
      try {
        this.getByIdTimeSheetData()
      } catch (error) {
      }
    } else { 
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
    const employeeTimesheetId = this.timeCardForm.get('employeeTimesheetId').setValue(this.timesheetId);
    const from = {
      EmployeeTimesheetId: employeeTimesheetId,
      PersonId: this.personId.personID,
      TimesheetStatus: 1
    };
    try {
      const response = await this.apiService.UpdateTimesheetStatus(from);
      if (response) {
        this.api.showToast('Save successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.router.navigate(['/home/existing-card']);
      }
    } catch { }

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
        this.api.showToast('Submitted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.router.navigate(['/home/existing-card']);
      }
    } catch (error) {
    }
    ;
  }
  public timeSheetRecords: any[] = [];
  getAllTimeCard() {
    this.loading = true
    const personID = JSON.parse(localStorage.getItem('userInfo')).personID;
    
    this.api.timeSheetDate$.subscribe(res => {
      let startDate =  this.datePipe.transform(res.startDate, 'YYYY-MM-dd')
      let endDate = this.datePipe.transform(res.endDate, 'YYYY-MM-dd');
      this.api.get(`Timesheet/timeSheetDetails?startDate=${startDate}&userId=${personID}&endDate=${endDate}`).subscribe((x) => {
        this.loading = false
        this.timeSheetRecords = x;
      })
    })
  }
  timesheetDateWiseData(element) {
    let dialogRef!: any
    const timeSheetData = element.records
    dialogRef = this.dialog.open(TimeSheetDateWiseComponent, {
      data: {
        data: timeSheetData,
        isEmployee: true,
      },
    })
  }
 async getByIdTimeSheetData(){
  this.loading =true
    const timesheetData = await this.apiService.getTimesheetById(this.timesheetId);
    this.loading = false 

    let uniqueArr = [];
   timesheetData.timesheetList.forEach((obj) => {
     if (uniqueArr?.length) {
      
       if (!(uniqueArr?.some(x => x.timesheetDate == obj.timesheetDate))) {
         uniqueArr.push({
          timesheetDate: obj.timesheetDate,
          totalHours : +obj.totalHours,
           records: [obj]
         });
       } else {
        let findIndex = uniqueArr?.findIndex(x => x.timesheetDate == obj.timesheetDate);
        uniqueArr[findIndex].totalHours += obj.totalHours;
        uniqueArr[findIndex].records.push(obj);
      }
     } else {
       uniqueArr.push({
        timesheetDate: obj.timesheetDate,
        totalHours : +obj.totalHours,
         records: [obj]
       });
     }
   });
   this.timeSheetRecords = uniqueArr;

    this.employeeTimesheetId = timesheetData.timesheetResponse.employeeTimesheetId
          this.DateShow = timesheetData.timesheetList.map((x) => {
            return {
              id:x.id,
              date:x.timesheetDate,
              totalHours: x.totalHours,
              comments: x.comments
            };
          });
          
          this.dataSource.data=this.DateShow
          this.dataSource.paginator = this.paginator;
          const TotalHours = timesheetData.timesheetResponse.totalHours;;
          this.totalHoursForAllEntries = TotalHours;
          this.convertedTime = this.decimalToHoursMinutes( TotalHours);
          this.startDate = moment(timesheetData.timesheetResponse.startDate).format('DD-MM-YYYY');
          this.endDate = moment(timesheetData.timesheetResponse.endDate).format('DD-MM-YYYY');
          this.status = timesheetData.timesheetResponse.status;
          this.minDate = moment(this.startDate, 'DD-MM-YYYY').toDate();
          this.maxDate = moment(this.endDate, 'DD-MM-YYYY').toDate();

        
          this.timeCardForm = this.fb.group({
            regulation: ['', Validators.required],
            timesheetDate: [null, Validators.required],
            timeType: ['', Validators.required],
            totalHours: ['', [Validators.required, Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
            comments: ['', Validators.required],
            employeeTimesheetId: ''
        
          });
  }
  decimalToHoursMinutes(decimalHours: number): { hours: number, minutes: number } {
    let hours = Math.floor(decimalHours);
    let minutes = Math.round((decimalHours - hours) *60);
    if (minutes == 60) {
      hours += 1;
      minutes = 0;
    }
    return { hours, minutes };
  }

  
submitForm() {
  this.loading = true;

  if (!this.timeCardForm.valid || !this.timeCardForm.dirty) {
    this.timeCardForm.markAllAsTouched();
    this.loading = false;
    return;
  }

  // Now patch values only after checking
  this.timeCardForm.get('employeeTimesheetId').setValue(this.timesheetId);
  const formattedDate = this.datePipe.transform(this.timeCardForm.value.timesheetDate, 'yyyy-MM-dd');
  this.timeCardForm.patchValue({ timesheetDate: formattedDate });

  if (this.timesheetId) {
    this.api.post(`TimesheetDetail/AddTimesheetDetails/${this.personId.personID}`, this.timeCardForm.value).subscribe((response) => {
      this.loading = false;
      if (response.statusCode === 200) {
        this.toastr.success('Add Success!', 'Success!');
        this.showForm = !this.showForm;
        this.getByIdTimeSheetData();
      }
    });

  } else if (this.id) {
    const updatePayload = {
      id: this.id,
      ...this.timeCardForm.value
    };
    this.api.put(`TimesheetDetail`, updatePayload).subscribe(() => {
      this.api.showToast('Update successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      this.showForm = !this.showForm;

      this.timeCardForm = this.fb.group({
        regulation: ['', Validators.required],
        timesheetDate: [null, Validators.required],
        timeType: ['', Validators.required],
        totalHours: ['', [Validators.required, Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
        comments: ['', Validators.required],
        employeeTimesheetId: ''
      });
    });
  }
}

  toggleForm() {
    this.showForm = !this.showForm;
    this.timeCardForm = this.fb.group({
      regulation: ['', Validators.required],
      timesheetDate: [null, Validators.required],
      timeType: ['', Validators.required],
      totalHours: ['', [Validators.required, Validators.pattern(/^(\d{0,2})(\.\d{0,2})?$/)]],
      comments: ['', Validators.required],
      employeeTimesheetId: ''
      
    });
  }

  onBtnClick() {
    this.location.back();
  }

  toggleShowAllCards() {
    this.showAllCards = !this.showAllCards;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  editTask(element) {
    this.showForm = true
    this.api.get(`TimesheetDetail/${element.id}`).subscribe((x) => {
      this.timeCardForm.patchValue(x.value)
      this.timeCardForm.get('regulation').setValue(x.value.regulation)
      this.timeCardForm.get('timeType').setValue(x.value.regulation)
    })
      this.timesheetId=element.employeeTimesheetId
      this.id=element.id
      }
  
      async delete(id){
        this.sweetlalert.deleteBtn();
        const confirmed = await this.sweetlalert.showDeleteConfirmation();
        if (confirmed) {   this.api.delete(`TimesheetDetail/${id}`).subscribe((x)=>{
          this.getByIdTimeSheetData()
          this.dataSource.data=x
          this.dataSource.paginator = this.paginator;
          this.api.showToast('Timesheet deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          },
          (error)=>{
            this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
          })}
      
      }
      roundHours(value: number): string {
        if (Number.isInteger(value)) {
          return value.toString();
        }
        return value.toFixed(2).replace(/\.?0+$/, '');
      }
}
export interface PeriodicElement {
  date: string;
  comments: string;
  totalHours: string;
}