import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastType } from 'src/app/service/common/common.model';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
@Component({
  selector: 'app-professional-tab',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatTableModule, CommonModule, MatPaginatorModule, DatePipe, ReactiveFormsModule],
  templateUrl: './professional-tab.component.html',
  styleUrls: ['./professional-tab.component.scss'],
})

export default class ProfessionalTabComponent implements OnInit {

  requestId: string
  form: FormGroup
  PersonExperienceId: string;
  yearsDifference: any;
  monthsDifference: any;
  isView?: boolean;
  isForm?: boolean = true;
  isSubmitting : boolean = false

  displayedColumns: string[] = Object.values(MyEnum);
  public userRole: Array<userRole> = [];
  dataSource = new MatTableDataSource<ExperienceData>();
  public experienceDetail: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateFormat:string = localStorage.getItem('Date_Format');

  @Input() public set isEducationTab(isProffesional: boolean) {
    this._isEducationTab = isProffesional;
  }

  public get isEducationTab(): boolean {
    return this._isEducationTab;
  }

  private _isEducationTab!: boolean;

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;
  @Output() isProffesionalTab: EventEmitter<boolean> = new EventEmitter();

  constructor(private api: CommonService, private formBuilder: FormBuilder, private datePipe: DatePipe, public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private sweetlalert: SweetalertService,) {
    this.form = this.formBuilder.group({
      companyName: ['', Validators.required],
      endDate: ['', Validators.required],
      personId: ['', Validators.required],
      startDate: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.getExperienceData();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "UserProfile";
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  Save() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    this.form.get("personId").setValue(this.requestId)
    this.form.removeControl('id')
    if (this.form.valid) {
      const formattedstartDate = this.datePipe.transform(this.form.value.startDate, 'yyyy-MM-dd');
      const formattedendDate = this.datePipe.transform(this.form.value.endDate, 'yyyy-MM-dd');
      this.form.patchValue({ startDate: formattedstartDate, endDate: formattedendDate });

      if (this.PersonExperienceId) {
        this.form.addControl("id", this.formBuilder.control('', Validators.required));
        this.form.get("id").setValue(this.PersonExperienceId)
        this.api.put(`PersonExperience`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Experience detail updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.getExperienceData();
            this.isProffesionalTab.emit(false);
            this.form.reset();
            this.isForm = true;
          }
        }, (error) => {
          this.api.showToast('Error update experience. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        })
      }
      else {
        this.api.post(`PersonExperience`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Experience detail saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.getExperienceData();
            this.isProffesionalTab.emit(false);
            this.form.reset();
            this.isForm = true;
          }
        }
          , (error) => {
            this.api.showToast('Error save experience. Please try again later.', ToastType.ERROR, ToastType.ERROR);
          })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }

  getExperienceData() {
    this.api.get(`Person/${this.requestId}/experience`).subscribe(
      (response) => {
        this.experienceDetail = response;
        return this.dataSource.data = response
      }
    );
  }

  getYearMonthDifference(startDate: string, endDate: string): string {
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (start >= end) {
      return "Invalid date range";
    }

    const diffTime = Math.abs(+end - +start);
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30);

    const yearsDifference = Math.floor(diffMonths / 12);
    const monthsDifference = diffMonths % 12;

    let result = '';
    if (yearsDifference > 0) {
      result += `${yearsDifference} year `;
    }
    if (monthsDifference > 0 || yearsDifference === 0) {
      result += `${monthsDifference.toFixed(1)} month`;
    }
    return result;
  }

  
  addExperience() {
    this.PersonExperienceId = null;
    this.isForm = false;
    this.isProffesionalTab.emit(true);
  }

  async deleteExperience(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`PersonExperience/${element.id}`).subscribe(() => {
        this.getExperienceData();
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.api.showToast('Experience deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }
  }

  editExperience(element) {
    this.api.get(`PersonExperience/${element.id}`).subscribe((res) => {
      this.isForm = false;
      this.form.setValue(res.value)
    })
    this.PersonExperienceId = element.id;
    this.isProffesionalTab.emit(true);
  }

  cancle() {
    this.isForm = true;
    this.isProffesionalTab.emit(false);
    this.form.reset()
  }

  trimNameOnBlur(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}

export interface ExperienceData {
  CompanyName?: string,
  StartDate?: string,
  EndDate?: string,
  id?: string
}
enum MyEnum {
  CompanyName = 'CompanyName',
  StartDate = 'StartDate',
  EndDate = 'EndDate',
  Actions = 'actions'
}

