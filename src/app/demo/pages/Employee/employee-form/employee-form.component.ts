import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Department, Designation, RoleId, ToastType } from 'src/app/service/common/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { DatePickerFormatDirective } from 'src/app/directives/date-picker-format.directive';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCropComponent } from './image-crop/image-crop.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    FormsModule,
    SharedModule,
    MatTabsModule
  ],
  providers: [DatePickerFormatDirective],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, AfterViewInit {
  enumLogin: { value: number; lable: string }[] = [
    { value: 1, lable: 'Microsoft' },
    { value: 2, lable: 'Google' },
    { value: 3, lable: 'Custom' }
  ];
  genderList: { value: number; lable: string }[] = [
    { value: 1, lable: 'Male' },
    { value: 2, lable: 'Female' },
    { value: 3, lable: 'Other' }
  ];
  maritalStatusenum: { value: string; lable: string }[] = [
    { value: 'Married', lable: 'Married' },
    { value: 'UnMarried', lable: 'UnMarried' }
  ];
  orderList = [
    { value: 1, lable: 'Professional Detail' },
    { value: 2, lable: 'Address Detail' },
    { value: 3, lable: 'Family Detail' },
    { value: 4, lable: 'Document' },
    { value: 5, lable: 'Finance' },
    { value: 6, lable: 'Finance' },
    { value: 7, lable: 'Asset' },
    { value: 8, lable: 'Project' }
  ];
  minDate: Date;
  maxDate: Date;
  getDate: any;
  form: FormGroup<any>;
  Designation: Array<Designation> = [];
  reportingManagerList: Array<any> = [];
  Department: Array<Department> = [];
  requestId: string;
  RoleId: Array<RoleId> = [];
  isView?: boolean;
  show = false;
  public showForm: boolean = true;
  password = 'password';
  public isSubmitted: boolean;
  loading: boolean = false;
  selectTabIndex = 0;
  public imageFileOnly: string;
  uploadedlogo: string | null = null;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  public employeeImage: any;
  public isFirstTime: boolean = true;
  imageChangedEvent: Event | null = null;
  selectedImage;
  croppedImage: SafeUrl = '';
  public isFormVisible: boolean = true;
  designationId: string = '';
  personId: string = '';
  deptId: string = '';

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.updateUserProfile();
      this.form.get('personCode').disable();
      this.form.get('roleId').disable();
      this.form.get('loginType').disable();
      this.form.get('DesignationId').disable();
      this.form.get('DepartmentId').disable();
      this.form.get('doj').disable();
      this.form.get('lastWorkingDay').disable();
      this.form.get('reportingPerson').disable();
      this.requestId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;

  @Output() isCancel: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('logoUploader') logoUploader!: ElementRef<HTMLInputElement>;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _commonService: CommonService,
    private api: CommonService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {
    this.form = this.buidForm();
    this.maxDate = new Date();
    this.imageFileOnly = this.api.imageFileOnly;

    if (this.route.snapshot.queryParamMap.get('tab')) {
      this.setTabIndex(this.route.snapshot.queryParamMap.get('tab'));
    }
  }
  public get getCategoryFormControl() {
    return this.form.controls;
  }

  ngOnInit() {
    const orgID = localStorage.getItem('orgId');
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });

    this.api.get(`Department`).subscribe((response) => {
      this.Department = response
    })
    this.api.get(`Roles/RoleByOrgId/${orgID}`).subscribe((response) => {
      this.RoleId = response.value;
    });
    this.getData();
    this.getReportingManager();
  }

  ngAfterViewInit() {}

  buidForm() {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      personCode: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      lastName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      contactNumber: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
      emergencyNumber: ['', [Validators.maxLength(15), Validators.pattern('^[0-9]*$')]],
      dob: ['', Validators.required],
      doj: ['', Validators.required],
      lastWorkingDay: [''],
      DepartmentId: [''],
      DesignationId: [{ value: '', disabled: this.isProfile }],
      roleId: ['', Validators.required],
      reportingPerson: ['', Validators.required],
      loginType: ['', Validators.required],
      Password: [
        '',
        [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#.?&])[A-Za-zd$@$!%*?&].{7,14}$')]
      ],
      organizationId: localStorage.getItem('orgId'),
      maritalStatus: ['', Validators.required],
      gender: ['']
    });
  }
  get employeeFormControl() {
    return this.form.controls;
  }

  public onLogoSelect(event: any) {
    if (!event.target.files.length) return;
    const file = event?.target?.files;
    if (file && file[0] && file[0]?.type?.includes('image/')) {
      this.dialog
        .open(ImageCropComponent, {
          height: '850px',
          width: '920px',
          data: { file: event }
        })
        .afterClosed()
        .subscribe((event: any) => {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (typeof e.target?.result === 'string') {
              this.uploadedlogo = e.target.result;
              this.isFirstTime = false;
            }
          };
          reader.readAsDataURL(event);
          if (event) {
            let formData = new FormData();
            formData.append('profilePicture', event);
            this.api.put(`Person/ProfilePicture?personId=${this.requestId}`, formData).subscribe(
              (res) => {
                this.api.showToast('Picture updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
                this.getData();
              },
              (error) => {
                this.api.showToast('Error updating picture. Please try again later.', ToastType.ERROR, ToastType.ERROR);
              }
            );
          }
        });
    } else {
      this.api.showToast('Upload image file only', ToastType.ERROR, ToastType.ERROR);
    }
  } 
  imageCropped(event: any) {
    this._fetchBlob(event?.objectUrl)
      .then((blob) => {
        const binaryFile = new File([blob], this.selectedImage?.name, { type: blob.type });
      })
      .catch((error) => console.error('Error fetching blob:', error));

    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event?.objectUrl);
  }

  deleteProfilePicture() {
    const personId = this.requestId; // Ensure requestId is set properly

    this.api.delete(`Person/DeleteProfilePicture?id=${personId}`).subscribe(
      (res: any) => {
        this.resetLogoUploader(); // Reset UI after successful deletion
        this.api.showToast(res.message, ToastType.SUCCESS, ToastType.SUCCESS);
      },
      (error) => {
        this.api.showToast('Error deleting picture. Please try again later.', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }

  resetLogoUploader() {
    this.logoUploader.nativeElement.value = null;
    this.form.controls['profilePicture']?.reset();
     this.uploadedlogo = '';
    this.isFirstTime = true;
  }

  triggerFileInput() {
    if (this.logoUploader) {
      this.logoUploader.nativeElement.click();
    }
  }

  getReportingManager() {
    this.api.get(`Person/listemployee`).subscribe((res) => {
      this.reportingManagerList = res;
    });
  }

  getData() {
    if (this.requestId) {
      this.api.get(`Person/${this.requestId}`).subscribe((res) => {
        this.getDate = this.datePipe.transform(res?.value?.doj, 'yyyy-MM-ddTHH:mm:ss');
        this.employeeImage = res?.value;

        let logo =
          res?.value?.profilePicture && res?.value?.profilePicture?.includes('.')
            ? `${environment.apiUrl.replace('api/', '')}` + res?.value?.profilePicture.replace('wwwroot\\', '')
            : '';
        this.uploadedlogo = logo;
        
        let persoId = JSON.parse(localStorage.getItem('userInfo'))?.personID
        if (persoId === res?.value?.id) {
          this.api.setProfilePicture(this.uploadedlogo);
        }
        this.form.patchValue(res?.value);
        this.form.get('DepartmentId')?.setValue(res?.value?.departmentId);
        this.form.get('DesignationId')?.setValue(res?.value?.designationId);
        this.form.get('emergencyNumber')?.setValue(res?.value?.emergencyNumber);
        this.form.get('RoleId')?.setValue(res?.value?.roleId);
        this.form.get('loginType')?.setValue(res?.value?.loginType);
        this.form.get('doj')?.setValue(res?.value?.doj);
      });
    }
  }

  updateUserProfile() {
    const formattedDob = this.datePipe.transform(this.form.value.dob, 'yyyy-MM-ddTHH:mm:ss');
    const formattedDoj = this.datePipe.transform(this.form.value.doj, 'yyyy-MM-ddTHH:mm:ss');
    const formattedLwd = this.datePipe.transform(this.form?.value?.lastWorkingDay, 'yyyy-MM-ddTHH:mm:ss');
    this.form.patchValue({ doj: formattedDoj, dob: formattedDob, lastWorkingDay: formattedLwd });
    this.form.removeControl('Password');
    let payload = {
      ...this.form.value,
      id: this.requestId,
      personCode: this.form.get('personCode')?.value,
      roleId: this.form.get('roleId')?.value,
      loginType: this.form.get('loginType')?.value,
      doj: this.getDate,
      DesignationId: this.form.get('DesignationId')?.value,
      DepartmentId: this.form.get('DepartmentId')?.value,
      lastWorkingDay: this.form.get('lastWorkingDay')?.value,
      reportingPerson: this.form.get('reportingPerson')?.value
    };
    if (this.requestId) {
      this.form.addControl('id', this.formBuilder.control('', Validators.required));
      this.form.get('id').setValue(this.requestId);
      this.api.put(`Person/UpdateProfile`, payload).subscribe(
        (res) => {
          if (res) {
            this.api.showToast('Employee details updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
            this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.api.showToast('Error updating employee details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  createEmployee() {
    if (
      this.form.valid ||
      this.form.get('loginType').value === 1 ||
      (this.form.get('loginType').value === 2 && this.form.value.Password == '') ||
      (this.form.get('loginType').value === 3 && this.form.value.Password != '') ||
      (this.requestId && this.form.value.Password == '')
    ) {
      const formattedDob = this.datePipe.transform(this.form?.value?.dob, 'yyyy-MM-ddTHH:mm:ss');
      const formattedDoj = this.datePipe.transform(this.form?.value?.doj, 'yyyy-MM-ddTHH:mm:ss');
      const formattedLwd = this.datePipe.transform(this.form?.value?.lastWorkingDay, 'yyyy-MM-ddTHH:mm:ss');
      this.form.patchValue({ doj: formattedDoj, dob: formattedDob, lastWorkingDay: formattedLwd });

      let keys = Object.keys(this.form.value);
      let formData = new FormData();
      keys.map((x) => {
        if (this.form.value[x]) {
          formData.append(x, this.form.value[x]);
        }
      });

      let payload = {
        ...this.form.value,
        id: this.requestId,
        personCode: this.form.get('personCode')?.value,
        roleId: this.form.get('roleId')?.value,
        loginType: this.form.get('loginType')?.value,
        doj: this.isProfile ? this.getDate : this.form.get('doj')?.value,
        DesignationId: this.form.get('DesignationId')?.value,
        DepartmentId: this.form.get('DepartmentId')?.value
      };
      if (this.requestId) { 
        delete payload.Password;
        this.form.addControl('id', this.formBuilder.control('', Validators.required));
        this.form.get('id').setValue(this.requestId);

        this.api.put(`Person`, payload).subscribe(
          (res) => {
            if (res) {
              this.api.showToast('Employee details updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
              this.router.navigate(['/employee-details']);
            } else {
              this.api.showToast(res?.errors[0]?.errorMessage, ToastType.WARNING, ToastType.WARNING);
            }
          },
          (error) => {
            this.api.showToast('Error while updating employee details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
          }
        );
      } else {
        const response = this.api.post(`Person`, this.form.value).subscribe(
          (res) => {
            if (res.statusCode === 200) {
              this.api.showToast('Employee details saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
              this.router.navigate(['/employee-details']);
            } else {
              this.api.showToast(res?.errors[0]?.errorMessage, ToastType.WARNING, ToastType.WARNING);
            }
          },
          (error) => {
            this.api.showToast('Error while adding employee details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
          }
        );
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  Cancel() {
    if (this.isProfile) {
      this.isCancel.emit(true);
    } else {
      this.router.navigate(['/employee-details']);
    }
  }

  onPasswordClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  setTabIndex(tabName: string) {
    switch (tabName) {
      case 'asset':
        this.selectTabIndex = 6;
        break;

      default:
        break;
    }
  }

  private _fetchBlob(url: string): Promise<Blob> {
    return fetch(url).then((response) => response.blob());
  }

  trimNameOnBlur(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

  //  When department is selected → fetch designations
  onDepartmentChange() {
    this.designationId = '';
    this.personId = '';
    this.Designation = []; 

    if (!this.deptId) return;

    this._commonService.get(`Designation/DesignationByDepartmentId?departmentId=${this.deptId}`).subscribe((res) => {
      this.Designation = res;
    });
  }
}
