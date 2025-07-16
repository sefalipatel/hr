import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from 'src/app/api.service';
import { DatePipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-user-holiday',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NgbNavModule,
    MatSlideToggleModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule
  ],
  templateUrl: './user-holiday.component.html',
  styleUrls: ['./user-holiday.component.scss']
})
export default class UserHolidayComponent {

  loading: boolean = false;
  years: number[] = [];
  selectedYear: number;
  displayedColumns: string[] = ['date', 'description', 'optional'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
  }

  onBtnClick() {
    this.router.navigate(['holiday-details/add-holiday']);
  }
  async ngOnInit() {
    this.loading = true
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year);
    }
    // Set the default selected year
    this.selectedYear = currentYear;
 
    try {
      const response = await this.apiService.yearWiseHoliday(this.selectedYear);
      this.loading = false
      const filteredData = response.filter((x) => {
        const date = + this.datePipe.transform(x.date, 'yyyy');
        return this.selectedYear == date
      });
      this.dataSource.data = filteredData;
    } catch (error) {
      console.error('Error fetching year-wise holiday data:', error);
    }
  }
  async onYearSelected(year) {
    this.selectedYear = year;
    try {
      const response = await this.apiService.yearWiseHoliday(year);
      const filteredData = response.filter((x) => {
        const date = + this.datePipe.transform(x.date, 'yyyy');
        return this.selectedYear == date
      });
      this.dataSource.data = filteredData;
    } catch (error) {
      console.error('Error fetching year-wise holiday data:', error);
    }
  }
  async editItem(id: string) {
    this.router.navigate([`holiday-details/add-holiday/${id}`]);
  }
}
export interface PeriodicElement {
  id: string;
  date: string;
  description: string;
  optional: boolean;
  No: number,
  employeeName:string
}
