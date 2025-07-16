import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import moment from 'moment';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonService } from 'src/app/service/common/common.service';

enum TimeCardStatus {
  Pending = 0,
  Save = 1,
  Submitted = 2
}

const TimeCardStatusLabels = {
  [TimeCardStatus.Pending]: 'Pending',
  [TimeCardStatus.Save]: 'Save',
  [TimeCardStatus.Submitted]: 'Submitted'
};

@Component({
  selector: 'app-existing-card',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, ReactiveFormsModule, MatNativeDateModule],
  templateUrl: './existing-card.component.html',
  styleUrls: ['./existing-card.component.scss']
})
export default class ExistingCardComponent {
  months: { value: number, name: string }[] = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  selectedMonth: number
  Alldata: { startDate: string; endDate: string; totalHours: number; status: number; id: string }[] = [];
  dateFormat: string = localStorage.getItem('Date_Format');

  // Alldata: any[] = [];
  years: number[] = [];
  dateRangeForm: FormGroup;
  endDate = new Date();
  startDate = moment(new Date()).subtract(21, 'days').toDate();
  datafilterTimesheet: any;
  selectedYear: any;
  // selectedMonth: any;
  constructor(
    private router: Router,
    private _location: Location,
    private fb: FormBuilder,
    private apiService: ApiService,
    private api: CommonService
  ) {
    this.dateRangeForm = this.fb.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required]
    });
  }

  onBtnClick() {
    this.router.navigate(['/home/add-time-card']);
  }

  backClicked() {
    this.router.navigate(['/home/time-card']);
  }

  async ngOnInit() {
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    const currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1;
    this.selectedYear = currentDate.getFullYear();
    this.filterYearMonthData()
   
  }
  getStatusLabel(status: number): string {
    return TimeCardStatusLabels[status] || 'Unknown';
  }

  oncardlistclick(data: any) {
    this.api.sendTimeSheetDate(data);
    this.router.navigate(['/home/add-time-card', data?.id]);
  }
  updateDateRangestartdate(value: any) {
    this.dateRangeForm.get("startDate").setValue(value)
  }
  updateDateRangeendDate(value: any) {
    this.dateRangeForm.get("endDate").setValue(value)
  }
 
  async onYearSelected(year) {
    this.selectedYear = year
    this.filterYearMonthData()
  }

  onMonthSelected(Month) {
    this.selectedMonth = Month
    this.filterYearMonthData()
  }
  async filterYearMonthData() {
    const fromdata = {
      year: this.selectedYear,
      month: this.selectedMonth ? this.selectedMonth : ""
    }

    this.api.get(`Timesheet/WeeklyTimeCard?year=${this.selectedYear}&month=${this.selectedMonth}`).subscribe((x) => {
      this.datafilterTimesheet = x
      if (this.datafilterTimesheet) {
        this.Alldata = this.datafilterTimesheet?.map((x) => {
          return {
            id: x.employeeTimesheetId,
            startDate: moment(x.startDate).format('DD-MM-YYYY'),
            endDate: moment(x.endDate).format('DD-MM-YYYY'), // Format the date
            totalHours: x.totalHours,
            status: x.status  
          };

        })
      }
    })
  }

}
