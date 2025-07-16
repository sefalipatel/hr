import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastType } from 'src/app/service/common/common.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common/common.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
export enum Relation {
  Father = 0,
  Mother = 1,
  Spouse = 2,
  Brother = 3,
  Sister = 4,
  Son = 5,
  Daughter = 6,
}
@Component({
  selector: 'app-family-details',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatTableModule, ReactiveFormsModule, DatePipe, MatDatepickerModule, MatRadioModule, SharedModule],
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export default class FamilyDetailsComponent implements OnInit {

  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  isView?: boolean;
  isForm?: boolean = false;
  isSubmitted: boolean;
  public familyForm: FormGroup<any>;

  public userRole: Array<userRole> = [];
  genderTypeList: { value: number, label: string }[] = [
    { value: 0, label: 'Female' },
    { value: 1, label: 'Male' },
    { value: 2, label: 'Other' },
  ]
  relationshipTypeList: any[] = [
    { value: 0, label: 'Father' },
    { value: 1, label: 'Mother' },
    { value: 2, label: 'Spouse' },
    { value: 3, label: 'Brother' },
    { value: 4, label: 'Sister' },
    { value: 5, label: 'Son' },
    { value: 6, label: 'Daughter' }
  ];
  bloodGroupList: { value: number, label: string }[] = [
    { value: 0, label: 'O Positive' },
    { value: 1, label: 'A Positive' },
    { value: 2, label: 'B Positive' },
    { value: 3, label: 'AB Positive' },
    { value: 4, label: 'AB Negative' },
    { value: 5, label: 'A Negative' },
    { value: 6, label: 'B Negative' },
    { value: 7, label: 'O Negative' }
  ];

  requestId: string
  form: FormGroup
  FamilyDetilsId: string

  displayedColumns: string[] = Object.values(MyEnum);
  dataSource = new MatTableDataSource<FamilyData>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }
  isSubmitting : boolean = false
  private _isProfile!: boolean;
  constructor(private api: CommonService, private route: ActivatedRoute, private formBuilder: FormBuilder, public dialog: MatDialog, private datePipe: DatePipe, private sweetlalert: SweetalertService,) {
    this.isSubmitted = false,
      this.familyForm = this.buildForm();
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.getFamilyDetails();
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

  buildForm() {
    return this.formBuilder.group({
      relationshipType: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      middleName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      dob: ['', Validators.required],
      contactNumber: ['', [Validators.minLength(10), Validators.maxLength(15), Validators.pattern(/^[0-9]\d*$/)]],
      bloodGroup: ['', Validators.required],
      gender: ['', Validators.required],
      personId: ['', Validators.required]
    })
  }

  get familyFormControl() {
    return this.familyForm.controls;
  }

  
  Save() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
  
    this.familyForm.get("personId").setValue(this.requestId);
  
    // Ensure the 'id' field is correctly set for editing
    if (this.FamilyDetilsId) {
      if (!this.familyForm.get("id")) {
        this.familyForm.addControl("id", this.formBuilder.control('', Validators.required));
      }
      this.familyForm.get("id").setValue(this.FamilyDetilsId);
    } else {
      if (this.familyForm.get("id")) {
        this.familyForm.removeControl('id');
      }
    }
  
    if (this.familyForm.valid) {
      const formattedDob = this.datePipe.transform(this.familyForm?.value?.dob, 'yyyy-MM-dd');
      this.familyForm.patchValue({ dob: formattedDob });
  
      if (this.FamilyDetilsId) {
        this.api.put(`PersonFamilyDetail`, this.familyForm?.value).subscribe(
          (res) => {
            if (res) {
              this.api.showToast('Family details updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
              this.isSubmitting = false;
              this.getFamilyDetails();
              this.isForm = false;
              this.familyForm.reset();
              this.FamilyDetilsId = null;
            }
          },
          (error) => {
            this.handleBackendErrors(error);
          }
        );
      } else {
        this.api.post(`PersonFamilyDetail`, this.familyForm?.value).subscribe(
          (res) => {
            if (res) {
              this.api.showToast('Family details saved successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
              this.isSubmitting = false;
              this.getFamilyDetails();
              this.isForm = false;
              this.familyForm.reset();
            }
          },
          (error) => {
            this.handleBackendErrors(error);
          }
        );
      }
    } else {
      this.isSubmitting = false; // Ensure it is reset if validation fails
      this.familyForm.markAllAsTouched();
    }
  }
  
  handleBackendErrors(error) {
    this.isSubmitting = false;
    
    if (error.error?.errors?.ContactNumber) {
      const backendError = error.error.errors.ContactNumber[0]; // Get the first error message
      this.api.showToast(backendError, ToastType.ERROR, ToastType.ERROR);
    } else {
      this.api.showToast('Error saving family details. Please check the form.', ToastType.ERROR, ToastType.ERROR);
    }
  }
  
  
  getFamilyDetails() {
    this.api.get(`Person/${this.requestId}/familyDetail`).subscribe((res) => {
      return this.dataSource.data = res
    })
  }

  async deleteFamilyDetails(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`PersonFamilyDetail/${element.id}`).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.api.showToast('Family details deleted successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
      }, (error) => {
        this.api.showToast('Error while deleting family details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
      })
      this.dataSource.data
    }
  }

  editFamilyDetails(element) {
    this.api.get(`PersonFamilyDetail/${element.id}`).subscribe((res) => {
      this.isForm = true;
      this.familyForm.setValue(res);
    })
    this.FamilyDetilsId = element.id
  }
  addFamilyDetail() {
    this.FamilyDetilsId = null;
    this.isForm = true;
  }
  cancle() {
    this.isForm = false;
    this.familyForm.reset()
  }

  numbersOnly(event) {
    let value = event.target.value;
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(/^[0-9]\d*$/)) {
      event.preventDefault();
    }
  }

  trimInput(controlName: string) {
    const control = this.familyForm.get(controlName);
    if (control && control.value) {
      control.setValue(control.value.trim())
    }
  }

  getRelation(relation?: any): any {
    switch (relation) {
      case Relation.Father:
        return 'Father';
      case Relation.Mother:
        return 'Mother';
      case Relation.Spouse:
        return 'Spouse';
      case Relation.Brother:
        return 'Brother';
      case Relation.Sister:
        return 'Sister';
      case Relation.Son:
        return 'Son';
      case Relation.Daughter:
        return 'Daughter';

      default:
        return '';
    }
  }
}
export interface FamilyData {
  firstName?: string,
  middleName?: string,
  lastName?: string,
  contactNumber?: string
  dob?: string,
  id?: string
}

enum MyEnum {
  firstName = 'firstName',
  middleName = 'middleName',
  lastName = 'lastName',
  relationshipType = 'relationshipType',
  contactNumber = 'contactNumber',
  dob = 'dob',
  Actions = 'actions'
}
