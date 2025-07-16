import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { MatSort, Sort } from '@angular/material/sort';
import { userRole } from 'src/app/assets.model';
import { ToastType } from 'src/app/service/common/common.model';
import { MatButtonModule } from '@angular/material/button';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export enum Status {
  InsideOffice = 1,
  OnBreak = 2,
  EndOfDay = 0,
  InMeeting = 3,
}
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatTableModule, CommonModule, MatPaginatorModule, MatButtonModule, SharedModule, MatIconModule, MatMenuModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export default class EmployeeListComponent implements OnInit {

  public statusLiist = [
    {
      name: 'Inside Office',
      value: Status.InsideOffice
    },
    {
      name: 'End Of Day',
      value: Status.EndOfDay
    },
    {
      name: 'On Break',
      value: Status.OnBreak
    },
        {
      name: 'In Meeting',
      value: Status.InMeeting
    }
  ];
  public FaceDataStatus = [
    {
      name: 'Captured',
      value: 1
    },
    {
      name: 'Not Captured',
      value: 0
    }
  ];
  loading: boolean = false;
  isListView: boolean = false;
  isCardView: boolean = true;
  public searchDataValue = '';
  imageUrl: string = environment.apiUrl.replace('api/', '');
  public tableData = [];
  public cardData = [];
  public profileData = [];
  displayedColumns: string[] = Object.values(MyEnum);
  public userRole: Array<userRole> = [];
  dataSource = new MatTableDataSource<EmployeeData>();
  designationList: any[] = [];
  roleList: any[] = [];
  selectedDesignation: string | null = null;
  selectedRole: string | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  attendanceData: any[];
  @ViewChild('file') file: ElementRef;
  selectedFile: any;
  extentions = [".xls", ".xlsx", ".csv",]
  attachmentUrl: string = environment.apiUrl.replace('api/', '')
  templateUrl: string = 'wwwroot\\EmployeeList\\EmployeeList_.xlsx';

  constructor(private api: CommonService, public dialog: MatDialog, private router: Router, private sweetlalert: SweetalertService,) {
  }

  ngOnInit() {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Employee";
      })
    }
    if (this.userRole[0]?.canEdit) {
      this.getAllEmployee();
    }
    this.getAllEmployeeCardRecords();
    this.getAllDesignation();
    this.getAllRoles();
  }

  customAuth(email) {
    this.api.put(`Person/AdminResetPassword?email=${email}`, '').subscribe(res => {
      if (res?.statusCode === 200) {
        this.api.showToast('Password has been reset successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      } else if (res?.statusCode == 400 || !res) {
        this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  getAllEmployee() {
    this.api.get(`Person`).subscribe(
      (response) => {
        this.tableData = response;
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }
  getAllEmployeeCardRecords() {
    this.api.get(`Person/GetAllEmployeeList`).subscribe(
      (response) => {
        this.cardData = response;
        this.profileData = response;
      }
    );
  }

  getAllDesignation() {
    this.api.get(`Designation`).subscribe((response) => {
      this.designationList = response
    })
  }
  getAllRoles() {
    let orgId = localStorage.getItem('orgId');
    this.api.get('Roles/RoleByOrgId' + `/${orgId}`).subscribe((res) => {
      this.roleList = res?.value;
    })
  }
  selectDesignation(designation?: any) {
    this.selectedDesignation = designation?.name;
    this.applyDesignationFilter();
  }
  selectedRoleName(role?: any) {
    this.selectedRole = role?.id;
    this.applyRoleFilter();
  }
  applyDesignationFilter(): void {
    const selectedDesignation = this.selectedDesignation ? this.selectedDesignation.toString().trim().toLowerCase() : '';
    let filteredData;
    if (!selectedDesignation) {
      if (this.selectedRole) {
        filteredData = this.tableData?.filter(item => {
          return item?.roleId?.trim().toLowerCase().includes(this.selectedRole);
        });
        this.dataSource = new MatTableDataSource<any>(filteredData);
      }
      else {
        this.dataSource = new MatTableDataSource<any>(this.tableData);
      }
      return;
    }
    filteredData = this.tableData.filter(item => {
      if (this.selectedRole) {
        return item.designation?.name?.trim().toLowerCase().includes(selectedDesignation) && item?.roleId?.trim().toLowerCase().includes(this.selectedRole);
      }
      else {
        return item.designation?.name?.trim().toLowerCase().includes(selectedDesignation);
      }
    });
    this.dataSource = new MatTableDataSource<any>(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyRoleFilter(): void {
    const selectedRole = this.selectedRole ? this.selectedRole.toString().trim().toLowerCase() : '';
    let filteredData;
    if (!selectedRole) {
      if (this.selectedDesignation) {
        filteredData = this.tableData?.filter(item => {
          return item.designation?.name?.trim().toLowerCase().includes(this.selectedDesignation.trim().toLowerCase());
        });
        this.dataSource = new MatTableDataSource<any>(filteredData);
        this.profileData = filteredData;
      }
      else {
        this.dataSource = new MatTableDataSource<any>(this.tableData);
        this.profileData = this.tableData;
      }
      return;
    }
    filteredData = this.tableData?.filter(item => {
      if (this.selectedDesignation) {
        return item?.roleId?.trim().toLowerCase().includes(selectedRole) && item.designation?.name?.trim().toLowerCase().includes(this.selectedDesignation.trim().toLowerCase());
      }
      else {
        return item?.roleId?.trim().toLowerCase().includes(selectedRole);
      }
    });
    this.dataSource = new MatTableDataSource<any>(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.profileData = filteredData;
  }

  public searchData(value: string): void {
    if (value === '') {
      if (this.selectedDesignation && this.selectedRole) {
        this.applyDesignationFilter();
        this.applyRoleFilter();
      }
      else if (this.selectedDesignation)
        this.applyDesignationFilter();
      else if (this.selectedRole)
        this.applyRoleFilter();
      else {
        this.dataSource.data = this.tableData;
        this.profileData = this.cardData;
      }
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        if (this.selectedDesignation && this.selectedRole) {
          return (item?.personCode.toLowerCase().includes(value.toLowerCase()) ||
            item?.firstName.toLowerCase().includes(value.toLowerCase()) ||
            item?.email.toLowerCase().includes(value.toLowerCase())) &&
            (item?.designation?.name.toLowerCase().includes(this.selectedDesignation.trim().toLowerCase()) &&
              item?.roleId?.trim().toLowerCase().includes(this.selectedRole)
            )
        }
        else if (this.selectedDesignation) {
          return (item?.personCode.toLowerCase().includes(value.toLowerCase()) ||
            item?.firstName.toLowerCase().includes(value.toLowerCase()) ||
            item?.email.toLowerCase().includes(value.toLowerCase())) &&
            (item?.designation?.name.toLowerCase().includes(this.selectedDesignation.trim().toLowerCase())
            )
        }
        else if (this.selectedRole) {
          return (item?.personCode.toLowerCase().includes(value.toLowerCase()) ||
            item?.firstName.toLowerCase().includes(value.toLowerCase()) ||
            item?.email.toLowerCase().includes(value.toLowerCase())) &&
            (item?.roleId?.trim().toLowerCase().includes(this.selectedRole))
        }
        else if (this.selectedRole) {
          return (item?.personCode.toLowerCase().includes(value.toLowerCase()) ||
            item?.firstName.toLowerCase().includes(value.toLowerCase()) ||
            item?.email.toLowerCase().includes(value.toLowerCase())) &&
            (item?.roleId?.trim().toLowerCase().includes(this.selectedRole))
        }
        else {
          return item?.personCode.toLowerCase().includes(value.toLowerCase()) ||
            item?.firstName.toLowerCase().includes(value.toLowerCase()) ||
            item?.designation?.name.toLowerCase().includes(value.toLowerCase()) ||
            this.getPriority(item?.attendanceStatus).toLowerCase().includes(value.toLowerCase()) ||
            item?.email.toLowerCase().includes(value.toLowerCase());
        }

      });
      this.profileData = this.cardData.filter((item) => {
        return item?.personCode?.toLowerCase().includes(value.toLowerCase()) ||
          item?.employeeName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.designamtionName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.departmentName?.toLowerCase().includes(value.toLowerCase()) ||
          item?.shiftName?.toLowerCase().includes(value.toLowerCase());
      })
    }
    return;
  }
  applyStatusFilter(selectedValue: any) {
    const selectedStatus = this.statusLiist.find(item => item.value === selectedValue);
    if (!selectedStatus) {
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.profileData = this.cardData;
    } else {
      const filteredData = this.tableData.filter(item => item.attendanceStatus === selectedStatus.value);
      const filteredDat = this.cardData.filter(item => item.attendanceStatus === selectedStatus.value);
      this.dataSource = new MatTableDataSource<any>(filteredData);
      this.profileData = filteredDat;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFaceDataStatusFilter(selectedValue: any) {
    const selectedStatus = this.FaceDataStatus.find(item => item.value === selectedValue);
    const TFValue = selectedStatus?.value? true : false;
    if (!selectedStatus) {
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.profileData = this.cardData;
    } else {
      const filteredData = this.tableData.filter(item => item.isCaptured === TFValue);
      const filteredDat = this.cardData.filter(item => item.isCaptured === TFValue);
      this.dataSource = new MatTableDataSource<any>(filteredData);
      this.profileData = filteredDat;
    }
  }
  getPriority(status?: Status): string {
    switch (status) {
      case Status.InsideOffice:
        return 'Inside Office';
      case Status.OnBreak:
        return 'On Break';
      case Status.EndOfDay:
        return 'End Of Day';
              case Status.InMeeting:
        return 'In Meeting';
      default:
        return '';
    }
  }

  AddEmployee() {
    this.router.navigate(['employee-details/add-employee'])
  }

  async deleteEmployee(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Person/${element.id}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this.dataSource = new MatTableDataSource<any>(this.dataSource.data.filter((item) => item.id !== element.id));
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.api.showToast('Employee deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (res?.statusCode == 400 || !res) {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }
  }

  async showStatusConfirmation(event: Event, id: any) {
    const confirmed = await this.sweetlalert.showStatusConfirmation();

    const target = event.target as HTMLInputElement;
    const status = target.checked;
    const originalChecked = !target.checked;

    if (confirmed) {
      this.api.put(`Person/${id}/active/${status}`, '').subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this.api.showToast('Status changed successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllEmployee();
        }
      }, (error) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      (event.target as HTMLInputElement).checked = originalChecked;
    }
  }

  editEmployee(element) {
    this.router.navigate([`employee-details/update-employee/${element.id}`])
  }
  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
          filteredRow['firstName'] = row?.firstName + ' ' + row?.lastName,
            filteredRow['ActiveStatus'] = this.getPriority(row?.attendanceStatus),
            filteredRow['designation'] = row?.designation?.name
          filteredRow['role'] = row?.roles?.name
        }
      });
      return filteredRow;
    });
    this.api.exportAsExcelFile(filteredData, 'EmployeeList', this.displayedColumns);
  }

  public uploadData(event) {
    if (event.target.files.length > 0) {
      if (!this.extentions.some(x => event.target.files[0].name.includes(x))) {
        this.file.nativeElement.value = '';
      }
      (err) => {
      }
      const file = event.target.files[0];
      this.selectedFile = file;
      this.onImport();
      this.file.nativeElement.value = null;

    }
  }
  onImport() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.api.post('Person/ImportEmployeeList', formData).subscribe(
      (res) => {
        this.api.showToast('Employee imported successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.getAllEmployee();
        this.getAllEmployeeCardRecords();
      },
      (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      }
    );
  }
  downloadTemplate() {
    saveAs(this.attachmentUrl + this.templateUrl.replace('wwwroot\\', ''), this.templateUrl.replace('wwwroot\\', ''));
  };

  onListView() {
    this.isListView = true;
    this.dataSource.data = this.tableData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isCardView = false;
  }
  onCardView() {
    this.isCardView = true;
    this.isListView = false;
  }
  transformImage(image: string): string {
    return image ? this.imageUrl + image.replace('wwwroot\\', '') : '';
  }
  stringToColor(string: any) {
    let hash = 0;
    let i;
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return string?.length ? color : '#bfbfbf';
  }

  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
  }
  sortData(event: Sort) {
    const data = this.dataSource.data.slice();
    if (!event.active || event.direction === '') {
      this.dataSource.data = data;
      return;
    }
    this.dataSource.data = data.sort((a, b) => {
      const isAsc = event.direction === 'asc';
      const personCodeA = a.employeeName ? a.employeeName.personCode : null;
      const personCodeB = b.employeeName ? b.employeeName.personCode : null;
      if (personCodeA === null && personCodeB === null) return 0;
      if (personCodeA === null) return isAsc ? 1 : -1;
      if (personCodeB === null) return isAsc ? -1 : 1;
      return (personCodeA < personCodeB ? -1 : 1) * (isAsc ? 1 : -1);
    });
  }
  goToEmployeeWebcam(element) {
    this.router.navigate([`employee-webcam/${element.id}`]);
  }
}
export interface EmployeeData {
  attendanceStatus: any;
  employeeName?: any,
  personCode?: any,
  firstName?: string,
  lastName?: string,
  ActiveStatus: any
  email?: string,
  designation?: any,
  roles?: any,
  name?: any,
  roleId?: string,
  id?: string,

}

enum MyEnum {
  personCode = 'personCode',
  firstName = 'firstName',
  manager = 'manager',
  department = 'department',
  email = 'email',
  designation = 'designation',
  role = 'role',
  isActive = 'isActive',
  Actions = 'actions',

}
