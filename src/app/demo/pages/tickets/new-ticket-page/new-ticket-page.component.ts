import { Component, HostListener, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ToastType } from 'src/app/service/common/common.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}
export enum StatusEnum {
  Available = 0,
  Assigned = 1,
  InProgress = 2,
  InReview = 3,
  ReOpen = 4,
  Completed = 5
}
export enum Ticket {
  ticketId = 'ticketId',
  subject = 'subject',
  assignedName = 'assignedName',
  createdName = 'createdName',
  createdDate = 'createdDate',
  dueDate = 'dueDate',
  priority = 'priority',
  status = 'status',
  actions = 'actions'
}
@Component({
  standalone: true,
  imports: [
    MatDatepickerModule,
    MatMenuModule,
    FormsModule,
    SharedModule,
    MatSortModule,
    CommonModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MaterialModule
  ],
  selector: 'app-new-ticket-page',
  templateUrl: './new-ticket-page.component.html',
  styleUrls: ['./new-ticket-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewTicketPageComponent {
  StatusEnum = StatusEnum;
  filterTicketForm: FormGroup;
  public priorityId: string;
  public searchDataValue = '';
  public personId = '';
  dropdownOpen: boolean = false;
  public newTicketCount: number = 0;
  public solvedTicketCount: number = 0;
  public openTicketCount: number = 0;
  public pendingTicketCount: number = 0;
  StartDate = new Date();
  EndDate = new Date();
  firstDayOfMonth = new Date();
  lastDayOfMonth = new Date();
  public ticketList: any[] = [];
  employeeRecords: any[] = [];
  filteredEmployeeRecords: any[] = [];
  public getAllDataById: any;
  public ticketId: string;
  public ticketDetails: any;
  dateFormat: string = localStorage.getItem('Date_Format');
  public userRole: Array<userRole> = [];
  loading: boolean = false;
  public priorityList = [
    {
      name: 'High',
      value: Priority.High
    },
    {
      name: 'Medium',
      value: Priority.Medium
    },
    {
      name: 'Low',
      value: Priority.Low
    }
  ];
  public statusList = [
    {
      name: 'Available',
      value: StatusEnum.Available
    },
    {
      name: 'Assigned',
      value: StatusEnum.Assigned
    },
    {
      name: 'In-Progress',
      value: StatusEnum.InProgress
    },
    {
      name: 'In-Review',
      value: StatusEnum.InReview
    },
    {
      name: 'Re-Open',
      value: StatusEnum.ReOpen
    },
    {
      name: 'Completed',
      value: StatusEnum.Completed
    }
  ];
  public widgetList: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = Object.values(Ticket);
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  options = [
    {
      label: 'High',
      value: 'high',
      bgColor: '#ffe5e5',
      textColor: '#b30000'
    },
    {
      label: 'Medium',
      value: 'medium',
      bgColor: '#e5ffe5',
      textColor: '#006600'
    },
    {
      label: 'Low',
      value: 'low',
      bgColor: '#e5f0ff',
      textColor: '#003399'
    }
  ];

  selectedOption = this.options[0]; // Default selection
  // Last available date (e.g., today)
  maxDate = new Date();

  // Set default to last (max) date
  selectedDate = this.maxDate;
  public assignedPersonName: any;
  @ViewChild('hiddenSelect') hiddenSelect: MatSelect;
  picker: any;
  eRef: any;
searchTerm: string = '';

  constructor(
    private router: Router,
    private _fb: FormBuilder,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    const currentDate = new Date();
    this.firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.lastDayOfMonth = this.getLastDayOfMonth(currentDate);
    this.filterTicketForm = this.buildForm();

    this.widgetList = [
      { name: 'New Tickets', count: 0, class: 'nt' },
      { name: 'Pending Tickets', count: 0, class: 'pt' },
      { name: 'Open Tickets', count: 0, class: 'ot' },
      { name: 'Solved Tickets', count: 0, class: 'st' },
    ];
  }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === '';
      });
    }
    this.onApply();
    this.getAllEmployee();

    this.personId = userPermissions?.personId;
  }

  buildForm() {
    return this._fb.group({
      StartDate: [this.firstDayOfMonth],
      EndDate: [this.lastDayOfMonth],
      Priority: [''],
      Status: ['']
    });
  }

  public getLastDayOfMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0);
  }

  getAllEmployee() {
    this.loading = true;
    this._commonService.get(`Person/listemployee`).subscribe((res) => {
      this.loading = false;
      this.employeeRecords = res;
      this.filteredEmployeeRecords = res;
    });
  }

  addTicket() {
    this.router.navigate(['ticket/ticket-form']);
  }

  updateStartDate(value: any) {
    this.filterTicketForm.get('StartDate').setValue(value);
  }

  updateEndDate(value: any) {
    this.filterTicketForm.get('EndDate').setValue(value);
  }

  updatePriority(ticketId?: string, priority?: number) {
    this._commonService.put(`Ticket/priority?ticketId=${ticketId}&priority=${priority}`, {}).subscribe(
      (res) => {
        this._commonService.showToast('Priority Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.onApply();
      },
      (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }

  updateStatus(ticketId, status) {
    this._commonService.put(`Ticket/status?ticketId=${ticketId}&status=${status}`, {}).subscribe(
      (res) => {
        this._commonService.showToast('Status Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.onApply();
      },
      (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }

  updateAssign(ticketId: any, assignId: string, assignName?: string) {
    console.log(this.searchTerm);
    
    this.searchTerm = ''
    console.log(this.searchTerm, "this.searchTerm::::::::::");
    const ticket = this.ticketList.find((t) => t.id === ticketId);
    this.assignedPersonName = assignName;
    if (ticket?.status === StatusEnum.Completed) {
      return; // Stop execution if status is Completed
    }
    if (assignId) {
      this._commonService.put(`Ticket/assign?ticketId=${ticketId}&assignId=${assignId}`, {}).subscribe(
        (res) => {
          this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
          // this.onApply();
          this.dataSource.data = [...this.ticketList];
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    } else {
      this._commonService.delete(`Ticket/RemoveUser?ticketId=${ticketId}`).subscribe(
        (res) => {
          this._commonService.showToast(`Assign removed successfully.`, ToastType.SUCCESS, ToastType.SUCCESS);
          this.onApply();
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  updateDueDate(ticketId, date) {
    const formattedDate = this.datePipe.transform(date?.value, 'yyyy-MM-ddTHH:mm:ss');
    this._commonService.put(`Ticket/dueDate?ticketId=${ticketId}&dueDate=${formattedDate}`, {}).subscribe(
      (res) => {
        this._commonService.showToast('Due Date Updated Successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.onApply();
      },
      (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }

  onApply() {
    let payload = {
      startDate: this.datePipe.transform(this.filterTicketForm.value.StartDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.filterTicketForm.value.EndDate, 'yyyy-MM-dd'),
      priority: this.filterTicketForm.value.Priority,
      status: this.filterTicketForm.value.Status
    };
    this._commonService.post(`Ticket/TicketList`, payload).subscribe((res) => {
      this.ticketList = res?.value?.tickets?.map((x) => {
        x.assignedName = x.assignedName?.trim();
        return x;
      });
      this.widgetList = [
        { name: 'New Tickets', count: res?.value?.available, class: 'nt' },
        { name: 'Pending Tickets', count: +res?.value?.assigned, class: 'pt' },
        { name: 'Open Tickets', count: +res?.value?.inProgress + +res?.value?.inReview + +res?.value?.reOpen, class: 'ot' },
        { name: 'Solved Tickets', count: res?.value?.closed, class: 'st' },
      ];
      this.dataSource = new MatTableDataSource<any>(this.ticketList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 300);
      this.dropdownOpen = false;
    });
  }

  onReset() {
    this.filterTicketForm.get(`StartDate`).setValue(this.firstDayOfMonth);
    this.filterTicketForm.get(`EndDate`).setValue(this.lastDayOfMonth);
    this.filterTicketForm.get(`Priority`).setValue('');
    this.filterTicketForm.get(`Status`).setValue('');
    this.onApply();
    this.dropdownOpen = false;
  }

  editTicket(id: any) {
    this.router.navigate([`ticket/ticket-form/${id}`]);
  }

  onTicketDetail(id: any) {
    this.router.navigate([`ticket-new-detail/${id}`]);
  } 

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`ticket/${element}`).subscribe(
        (res) => {
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
          this.onApply();
          if (res?.value == 'Ticket is already assigned to someone.') {
            this._commonService.showToast(res?.value, ToastType.WARNING, ToastType.WARNING);
          } else {
            this._commonService.showToast(`Ticket deleted successfully`, ToastType.SUCCESS, ToastType.SUCCESS);
          }
        },
        (err) => {
          this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
      this.dataSource.data;
    }
  }

  getPriority(priority?: Priority): string {
    switch (priority) {
      case Priority.High:
        return 'High';
      case Priority.Medium:
        return 'Medium';
      case Priority.Low:
        return 'Low';
      default:
        return '';
    }
  }

  getStatus(status?: StatusEnum): string {
    switch (status) {
      case StatusEnum.Available:
        return 'Available';
      case StatusEnum.Assigned:
        return 'Assigned';
      case StatusEnum.InProgress:
        return 'In-Progress';
      case StatusEnum.InReview:
        return 'In-Review';
      case StatusEnum.ReOpen:
        return 'Re-Open';
      case StatusEnum.Completed:
        return 'Completed';
      default:
        return '';
    }
  }

  public searchData(value: string): void {
    if (value === '') {
      this.dataSource.data = this.ticketList;
    } else {
      this.dataSource.data = this.ticketList.filter((item) => {
        const searchStatus = this.getStatus(item?.status);
        const searchPriority = this.getPriority(item?.priority);
        const searchCreatedDate = this.datePipe.transform(item?.createdDate, 'mediumDate');
        const searchDueDate = this.datePipe.transform(item?.dueDate, 'mediumDate');

        return (
          item.ticketCode?.toLowerCase().includes(value.toLowerCase()) ||
          item?.subject?.toLowerCase().includes(value.toLowerCase()) ||
          item?.assignedName?.toLowerCase().includes(value.toLowerCase()) ||
          searchCreatedDate?.toString().toLowerCase().includes(value.toString().toLowerCase()) ||
          searchDueDate?.toString().trim().toLowerCase().includes(value.toString().trim().toLowerCase()) ||
          searchStatus.toLowerCase().includes(value.toLowerCase()) ||
          searchPriority.toLowerCase().includes(value.toLowerCase())
        );
      });
    }
    return;
  }

  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const ticketCodeA = a.ticket ? a.ticket.ticketCode : null;
      const ticketCodeB = b.ticket ? b.ticket.ticketCode : null;
      if (ticketCodeA === null && ticketCodeB === null) return 0;
      if (ticketCodeA === null) return isAsc ? 1 : -1;
      if (ticketCodeB === null) return isAsc ? -1 : 1;
      return (ticketCodeA < ticketCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }

  @ViewChildren('selectRef') selects: QueryList<MatSelect>;

  openSelect(index: number) {
    const select = this.selects.toArray()[index];
    if (select) {
      select.open();
    }
  }
  
  getPriorityStyles(priority: number) {
    switch (priority) {
      case Priority.High:
        return { backgroundColor: '#ffe5e5', color: 'red' }; // Red
      case Priority.Medium:
        return { backgroundColor: '#e5ffe5', color: '#000' }; // Yellow
      case Priority.Low:
        return { backgroundColor: '#e5f0ff', color: 'blue' }; // Green
      default:
        return {};
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onDateChange(event: any) {
    // You can handle the date selection here
    console.log('Selected date:', event.value);
    // Do NOT close the dropdown here
  }

  applyFilter() {
    // Apply the filter logic here
    this.dropdownOpen = false; // Close dropdown manually if needed
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
  filterEmployees() {
    if (this.searchTerm == '') {
      this.employeeRecords = this.filteredEmployeeRecords
    } else {
      const term = this.searchTerm.toLowerCase();

      this.employeeRecords = this.filteredEmployeeRecords.filter(emp =>
        (emp.firstName + ' ' + emp.lastName).toLowerCase().includes(term)
      );
    }
  }
  onSelectOpened() {
    this.searchTerm = '';
    this.employeeRecords = this.filteredEmployeeRecords;
  }

}
