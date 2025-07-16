import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionSelectionChange } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ToastType } from 'src/app/demo/models/models';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'src/app/theme/shared/shared.module';

export interface user {
  id: string; 
  user: string;
  projectId: string;
  startDate: string;
  endDate: string;
  designation: string;
  isActive: string;
}

@Component({
  selector: 'app-assignuser',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './assignuser.component.html',
  styleUrls: ['./assignuser.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    MatIconModule,
    MatSlideToggleModule
  ]
})
export class AssignuserComponent implements OnInit, AfterViewInit {
  @ViewChild('search') searchTextBox: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  userForm: FormGroup;
  isView?: boolean;
  title: string = 'Assign User';
  id: string = '';
  personId: string = '';
  requestedUserId: string = '';
  projectData: user;
  projectId: string = '';
  dataSource = new MatTableDataSource<user>();
  getprojectData: any = [];
  projectlistdata: any = [];
  employeeList: any[] = [];
  designationList: any[] = [];
  filterEmployeeList: any[] = [];
  selectedProject: string = '';
  EmployeeSelected: string = '';
  public tableData: Array<user> = [];
  selectFormControl = new FormControl([], [Validators.required]);
  searchTextboxControl = new FormControl();
  selectedValues = [];
  dateFormat: string = localStorage.getItem('Date_Format');
  isAssignProjectuser: boolean = true;
  filteredSubTypeData: any[] = [];
  visitorSubTypeData: any[] = [];
  public AddAssignProjectuserId!: string;
  loading: boolean = false;
  public userRole: Array<userRole> = [];
  displayedColumns: string[] = ['user', 'project', 'designation', 'startDate', 'endDate', 'isActive', 'actions'];
  projectmember: any;
  isSubmitting: boolean = false;
  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
    this.requestedUserId = requestId;
    this.displayedColumns =
      this.isProfile || this.requestId
        ? ['project', 'designation', 'startDate', 'endDate', 'isActive']
        : ['user', 'designation', 'startDate', 'endDate', 'isActive', 'actions'];
  }
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;

    this.id = this.activeRoute?.snapshot?.params['id'] ?? '';
    this.personId = JSON.parse(localStorage.getItem('userInfo')).personID;

    setTimeout(() => {
      if (profile) {
        this.getAllAssignProjectuserData(this.personId, 'ProjectMembers/person/', true);
      } else if (this.id) {
        this.getAllAssignProjectuserData(this.id, 'ProjectMembers/person/', true);
      } else {
        this.getAllAssignProjectuserData(this.id, 'ProjectMembers/project/', true);
      }
    }, 1000);
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private api: CommonService,
    private _commonService: CommonService,
    private route: Router,
    private sweetlalert: SweetalertService,
    private datePipe: DatePipe
  ) {
    this.userForm = this._fb.group({
      projectId: [''],
      projectName: [''],
      personsId: [''],
      designationId: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  ngAfterViewInit() {
    if (!this.isProfile)
      this.getAllAssignProjectuserData(
        this.id,
        this.route.url?.includes('project-dashboard') ? 'ProjectMembers/project/' : 'ProjectMembers/person/',
        true
      );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';

    this.getByIdProject();

    this.searchTextboxControl.valueChanges.subscribe((data) => {
      this.filterEmployeeList = this._filter(data);
    });

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter((item) => {
        return item?.module?.module === 'Projects';
      });
    }
    this.getAllDesignation();
    this.getAllAssignProjectuserData(this.id, 'ProjectMembers/project/', true); 
  }

  getByIdProject() {
    if (this.id && !this.isProfile) {
      this.api.get('ProjectManagement/' + this.id).subscribe((res) => {
        this.projectData = res.value;
        this.userForm.controls['projectId'].setValue(this.projectData.id);
        this.userForm.controls['projectName'].setValue(res?.value?.projectName);
        this.userForm.controls['startDate'].setValue(res?.value?.startDate);
        this.userForm.controls['endDate'].setValue(res?.value?.endDate);
        this.userForm.controls['projectName'].disable();
        this.userForm.controls['designationId'].reset();
        this.selectFormControl.reset();
        this.projectmember = res.value?.projectMembers;
        this.dataSource.data = this.projectmember;
      });
    }
  }

  getAllDesignation() {
    this._commonService.get(`Designation`).subscribe((res) => {
      this.designationList = res;
    });
  }
  createprojectuser() {}

  onClick() {}
  get userFormControl() {
    return this.userForm.controls;
  }
  onProjectSelected(id) {
    this.selectedProject = id;
  }
  onEmployeeSelected(id) {
    this.selectedProject = id;
  }
  filteredOptions: any;
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);

    let filteredList = filterValue
      ? this.employeeList.filter((option) => option.personName?.toLowerCase().indexOf(filterValue) === 0)
      : this.employeeList;
    return filteredList;
  }

  clearSearch(event) { 
    this.searchTextboxControl.patchValue('');
  }

  setSelectedValues() {
    if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
      this.selectFormControl.value.forEach((e) => {
        if (this.selectedValues.indexOf(e) == -1) {
          this.selectedValues.push(e);
        }
      });
    }
  }

  getEmployeeName(selectedIds: any[]) {
    if (!selectedIds || selectedIds.length === 0) return '';
    return selectedIds
      .map((id) => {
        const emp = this.employeeList.find((emp) => emp.personId === id);
        return emp ? emp.personName : '';
      })
      .filter((name) => name)
      .join(', ');
  }

  selectionChange(event: MatOptionSelectionChange, option: any) {
    if (event.isUserInput) {
      let selectedValues = this.selectFormControl.value || [];
      if (event.source.selected) {
        selectedValues.push(option.personId);
      } else {
        selectedValues = selectedValues.filter((id) => id !== option.personId);
      }
      this.selectFormControl.setValue([...new Set(selectedValues)]);
    }
  }
  compareUser = (o1: any, o2: any): boolean => {
    return o1 && o2 && o1.personId === o2.personId;
  };

  openedChange(isOpen: boolean) {
    if (isOpen) {
      this.searchTextboxControl.patchValue('');
      setTimeout(() => {
        this.searchTextBox?.nativeElement.focus();
      }, 100);
    }
  }
  onDesignationChange(event) {
    this._commonService.get(`ProjectMembers/GetPersonListByProjectId?designationId=${event?.value}`).subscribe((res) => {
      this.employeeList = res;
      this.filterEmployeeList = res;
      this.selectedValues = [];
      this.selectFormControl.setValue([]);
      this.selectFormControl.updateValueAndValidity({ emitEvent: false });
    });
  }
  navigate() {
    this.router.navigateByUrl('/project-dashboard');
  }
  reset() {
    this.userForm.controls['personsId'].setValue('');
    this.userForm.controls['startDate'].setValue('');
    this.userForm.controls['endDate'].setValue('');
    this.selectFormControl.patchValue([]);
    this.selectedValues = [];
  }
  AssignProjectuser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.selectFormControl.markAsTouched();
      return;
    }
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    const formattedDate = this.datePipe.transform(this.userForm.value.startDate, 'yyyy-MM-ddTHH:mm:ss');
    const formattedEndDate = this.datePipe.transform(this.userForm.value.endDate, 'yyyy-MM-ddTHH:mm:ss');
    this.userForm.patchValue({ startDate: formattedDate, endDate: formattedEndDate });

    if (this.isAssignProjectuser) {
      delete this.userForm.value['projectName'];

      this.userForm.controls['personsId'].setValue(this.selectFormControl.value);

      this._commonService.post('ProjectMembers', this.userForm.value).subscribe({
        next: (res) => {
          if (res?.value) {
            this._commonService.showToast('Project Assigned Successfully', ToastType.SUCCESS, ToastType.SUCCESS);
            this.isSubmitting = false;
            setTimeout(() => {
              this.getAllAssignProjectuserData(this.id, 'ProjectMembers/project/');
            }, 500);
            this.getByIdProject();
            this.reset();
          } else {
            this._commonService.showToast(res?.errors?.[0]?.errorMessage || 'An error occurred', ToastType.ERROR, ToastType.ERROR);
          }
        },
        error: (err) => {
          const errorMsg = err?.error?.projectAssigned || err?.error?.message || 'Something went wrong';
          this._commonService.showToast(errorMsg, ToastType.ERROR, ToastType.ERROR);
        }
      });
    } else {
      this._commonService
        .put('ProjectMembers', {
          id: this.AddAssignProjectuserId,
          projectId: this.userForm.value.projectId,
          startDate: this.userForm.value.startDate,
          endDate: this.userForm.value.endDate,
          personsId: this.userForm.value.personsId
        })
        .subscribe(
          (res) => {
            if (res) {
              this._commonService.showToast('Project Assigned Successfully', ToastType.SUCCESS, ToastType.SUCCESS);
              this.isSubmitting = false; 
              this.reset();
            } else {
              this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR);
            }
          },
          (err) => {
            this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
          }
        );
    }
  }

  filteredSubType(visitorTypeId: string) {
    let filteredSubType = this.visitorSubTypeData.filter((res) => res.visitorTypeId === visitorTypeId);
    this.filteredSubTypeData = filteredSubType;
  }
  getAllAssignProjectuserData(id?: string, url?: string, isProfile?: boolean) {
    this.api.get(url + id).subscribe((res) => {
      this.dataSource = new MatTableDataSource<user>(res?.value);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 500);
    });
  }
  editProjectAssignmember(id: any) {
    id ? this.router.navigate([`${id}`]) : this.router.navigate(['/project/assignUser/']);
  } 

  async deleteBtn(id: string) {
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`ProjectMembers/${id}`).subscribe(
        (res) => {
          if (res?.statusCode === 200 || !res) {
            this._commonService.showToast('ProjectMember deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
            this.getAllAssignProjectuserData(this.id, 'ProjectMembers/project/');
          } else if (res?.statusCode === 400) {
            this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR);
          }
        },
        (err) => {
          this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  activeStatusChange(status: MatSlideToggleChange, data: any) {
    this.loading = true;
    this._commonService.put(`ProjectMembers/${data}/active/${status.checked}`, '').subscribe(
      (res) => {
        this.loading = false;
        if (this.isProfile || this.requestId) {
          this.getAllAssignProjectuserData(this.personId, 'ProjectMembers/person/', true);
        } else {
          this.getAllAssignProjectuserData(this.id, 'ProjectMembers/project/', true);
        }
      },
      (error) => {}
    );
  }
  convertStatus(value) {
    const status = ['', 'In Progress', 'Completed', 'On Hold', 'Backlog'];
    let list = status.filter((item, index) => index == value);
    return list;
  }
}
