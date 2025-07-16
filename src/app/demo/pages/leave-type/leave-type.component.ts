import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Department, Designation, ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-leave-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, FormsModule],
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.scss']
})
export class LeaveTypeComponent implements OnInit {
  public isleavetypeAdd: boolean = false;
  public isleavetypeTittle: boolean = false;
  public leaveTypeId: string = '';
  public iconURL: string = '';
  Department: Array<Department> = [];
  Designation: Array<Designation> = [];
  public leavetypeform: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public imageFileOnly: string;
  public uploadedlogo;
  public defaultUploadedlogo;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  File: File | undefined;
  @ViewChild('favIconUploader') favIconUploader!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private api: CommonService,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService
  ) {
    this.leavetypeform = this.buildform();
    this.imageFileOnly = this._commonService.imageFileOnly;
  }

  displayedColumns: string[] = ['logo', 'leaveType', 'actions'];

  leaveTypeList: any[] = [];

  ngOnInit(): void {
    this.api.get(`Designation`).subscribe((response) => {
      this.Designation = response;
    });
    this.api.get(`Department`).subscribe((response) => {
      this.Department = response;
    });
    this.getAllLeaveTypes();
  }

  buildform() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      logo: [''],
    });
  }
  get leavetypeFormControl() {
    return this.leavetypeform.controls;
  }
  addLeaveType() {
    this.isleavetypeAdd = true;
    this.leaveTypeId = '';
    this.isleavetypeTittle = true;
  }

  resetForm() {
    this.resetLogoUploader();
    this.leavetypeform.reset();
    this.isleavetypeTittle = false;
    this.leaveTypeId = '';
  }
  trimNameOnBlur(controlName: string) {
    const control = this.leavetypeform.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  OnSelectedFile(e) {
    const file = e?.target.files;
    if (file && file[0] && file[0]?.type?.includes("image/")) {
      const file = e.target.files[0];
      this.File = file
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          this.uploadedlogo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this._commonService.showToast('Upload image file only', ToastType.ERROR, ToastType.ERROR)
    }
  }

  resetLogoUploader() {
    this.favIconUploader.nativeElement.value = null;
    this.File = null;
    this.iconURL = ''
    this.uploadedlogo = this.defaultUploadedlogo ?? '';
  }

  onSubmit() {
    if (this.leavetypeform.invalid) {
      this.leavetypeform.markAllAsTouched();
      return;
    }
    let keys = Object.keys(this.leavetypeform.value);
    let formData = new FormData();
    keys.forEach(key => {
      let value = this.leavetypeform.value[key];
      if (value || value == 0 && key !== 'logo') {
        formData.append(key, value);
      }
    });
    
    if (this.File) {
      formData.append('logo', this.File);
    } else { 
    }

    if (this.leaveTypeId === '') {
      this.api.post('LeaveType', formData).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._commonService.showToast('Leave type added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllLeaveTypes();
          this.resetForm();
        }
      }, err => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
      });
    } else {
      formData.append('id', this.leaveTypeId);
      this.api.put('LeaveType', formData).subscribe((res: any) => {
        if (res.statusCode === 200) {
          this._commonService.showToast('Leave type updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllLeaveTypes();
          this.resetForm();
        }
      }, err => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
      });
    }
    this.File = null;

  }

  editLeaveType(id: string) {
    this.api.get(`LeaveType/${id}`).subscribe((res: any) => {
      if (res.statusCode === 200 && res.value) {
        const item = res.value;
        this.iconURL = item.icon;
        this.leavetypeform.patchValue({
          name: item.name,
        });
        this.leaveTypeId = item.id;
        this.isleavetypeAdd = true;
        this.isleavetypeTittle = false;
      }
    });
  }

  async deleteBtn(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete('LeaveType' + `/${element.id}`).subscribe(
        (res) => {
          if (res?.statusCode == 200 || !res) {
            this._commonService.showToast('Leave-type deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
            this.getAllLeaveTypes();
          } else if (res?.statusCode == 400 || !res) {
            this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR);
          }
        },
        (err) => {
          this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  getAllLeaveTypes() {
    this._commonService.get('LeaveType').subscribe((res: any) => {
      if (res.isSuccessful === false && res.statusCode === 200) {
        this.leaveTypeList = res?.value || [];
        this.dataSource = new MatTableDataSource<any>(this.leaveTypeList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  transformImagePath(filePath: string): string {
    return this.imageUrl + filePath.replace('wwwroot\\', '');
  }
}
