import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, numberAttribute } from '@angular/core';
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
import DeletePopUpComponent from '../../pages/delete-pop-up/delete-pop-up.component';
import { filter } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModel } from '@angular/forms';
import { SweetalertService } from '../../pages/role-list/sweetalert.service';
import { ToastType } from '../../models/models';

@Component({
  selector: 'app-welcome',
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
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export default class HolidayComponent implements AfterViewInit {
  isView?: boolean;
  loading: boolean = false;
  years: number[] = [];
  userRole: Array<any> = [];
  selectedYear: number;
  displayedColumns: string[] = ['date', 'description', 'optional', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateFormat:string = localStorage.getItem('Date_Format');

  constructor(
    private router: Router,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private sweetlalert: SweetalertService,
  ) {
  }

  onBtnClick() {
    this.router.navigate(['holiday-details/add-holiday']);
  }

  async ngOnInit() {
    this.loading = true
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 5; year--) {
      this.years.push(year + 1);
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
      this.apiService.showToast('Error fetching year-wise holiday data', ToastType.ERROR, ToastType.ERROR)
    }
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Holiday";
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      this.apiService.showToast('Error fetching year-wise holiday data', ToastType.ERROR, ToastType.ERROR)
    }
  }

  async deleteItem(id: string): Promise<void> {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      try {
        await this.apiService.deleteData(id);
        this.dataSource.data = this.dataSource.data.filter((element) => element.id !== id);
        this.apiService.showToast(`Item  deleted successfully`, ToastType.ERROR, ToastType.ERROR)
      } catch (error) {
        this.apiService.showToast(`Error deleting item with ID ${id}`, ToastType.ERROR, ToastType.ERROR)
      }
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
}
