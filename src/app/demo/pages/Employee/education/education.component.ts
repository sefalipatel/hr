import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { ToastType } from 'src/app/service/common/common.model';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatTableModule, CommonModule, MatPaginatorModule, DatePipe, ReactiveFormsModule, SharedModule, MatSelectModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export default class EducationComponent implements OnInit {

  Grades: { value: number, label: string }[] = [
    { value: 1, label: 'Distinction' },
    { value: 2, label: 'FirstClass' },
    { value: 3, label: 'Pass' },
    { value: 4, label: 'Fail' }
  ];
  selectedGrade: number;
  isForm?: boolean = false;
  requestId: string
  form: FormGroup
  PersonEducationId: string;
  public userRole: Array<userRole> = [];
  years: number[] = Array.from({ length: 20 }, (_, index) => new Date().getFullYear() - index);
  selectedYear: number;
  isView?: boolean;

  displayedColumns: string[] = Object.values(MyEnum);
  dataSource = new MatTableDataSource<EducationData>();
  public educationDetail: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() public set isProffesionalTab(isProffesional: boolean) {
    this._isProffesionalTab = isProffesional;
  }

  public get isProffesionalTab(): boolean {
    return this._isProffesionalTab;
  }

  private _isProffesionalTab!: boolean;

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo'))?.personID
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }
  isSubmitting : boolean = false
  private _isProfile!: boolean;
  @Output() isEducation: EventEmitter<boolean> = new EventEmitter();

  constructor(private api: CommonService, private formBuilder: FormBuilder, public dialog: MatDialog, private route: ActivatedRoute, private sweetlalert: SweetalertService,) {
    this.form = this.formBuilder.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      passingYear: ['', Validators.required],
      personId: ['',],
      grade: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.getEducationData();
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
    this.form.get("personId")?.setValue(this.requestId);
    this.form.removeControl('id')

    if (this.form.valid) {
      if (this.PersonEducationId) {
        this.form.addControl("id", this.formBuilder.control('', Validators.required));
        this.form.get("id").setValue(this.PersonEducationId);
        this.api.put(`PersonEducation`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Education details updated sucessfully.', "SUCCESS", ToastType.SUCCESS)
            this.isSubmitting = false
            this.getEducationData();
            this.isForm = false;
            this.isEducation.emit(false);
            this.form.reset();
          }
        }, (error) => {
          this.api.showToast('Error update education details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        }
        )
      } else {
        this.form.removeControl('id')
        this.api.post(`PersonEducation`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Education details saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.getEducationData();
            this.isForm = false;
            this.isEducation.emit(false);
            this.form.reset();
          }
        }, (error) => {
          this.api.showToast('Error save education details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }

  getEducationData() {
    this.api.get(`Person/${this.requestId}/education`).subscribe(
      (response) => {
        this.educationDetail = response
        return this.dataSource.data = response
      },
      (err) => {
      }
    );
  }

  getStatusLabel(status: number): string {
    const grade = this.Grades.find(grade => grade.value === status);
    return grade ? grade.label : 'Unknown';
  }

  addEducation() {
    this.PersonEducationId = null;
    this.isForm = true;
    this.isEducation.emit(true);
  }

  async deleteEducation(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`PersonEducation/${element.id}`).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.getEducationData();
        this.api.showToast('Education deleted successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
      }, (error) => {
        this.api.showToast('Error while deleting education. Please try again later.', ToastType.ERROR, ToastType.ERROR);
      })
      this.dataSource.data
    }
  }

  editEducation(element) {
    this.api.get(`PersonEducation/${element.id}`).subscribe((res) => {
      this.isForm = true;
      const passingYear = Number(res?.passingYear);
      this.form.patchValue({
        passingYear: passingYear,

        degree: res?.degree,
        grade: res?.grade,
        institution: res?.institution,
        personId: res?.personId
      });
    })
    this.PersonEducationId = element.id;
    this.isEducation.emit(true);
  }

  cancle() {
    this.isForm = false;
    this.isEducation.emit(false);
    this.form.reset()
  }

  trimNameOnBlur(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}

export interface EducationData {
  institution?: string,
  Course?: string,
  passingYear?: number,
  Grade?: number
  id?: string
}

enum MyEnum {
  institution = 'institution',
  Course = 'Course',
  passingYear = 'passingYear',
  Grade = 'Grade',
  Actions = 'actions'
}

