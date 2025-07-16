import { Component, ElementRef, Input, NgModule, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastType } from 'src/app/service/common/common.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatPaginatorModule,MatTooltipModule, MatTableModule, SharedModule, DatePipe, MatDatepickerModule],
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
  providers: [DatePipe]
})
export default class DocumentDetailsComponent implements OnInit {

  documentTypeenum: { value: number, label: string }[] = [
    { value: 1, label: 'Aaadhar' },
    { value: 2, label: 'PAN' },
    { value: 3, label: 'DrivingLicense' },
    { value: 4, label: 'Passport' },
    { value: 5, label: 'Resume' },
    { value: 7, label: 'PF' },
    { value: 6, label: 'Others' }
  ];

  requestId: string;
  imagePath: string;
  form: FormGroup;
  documentId: string;
  File: File | undefined;
  public userRole: Array<userRole> = [];
  isForm?: boolean = false;
  attachmentUrl: string = environment.apiUrl.replace('api/', '')
  isSubmitting : boolean = false;
  displayedColumns: string[] = Object.values(MyEnum);
  dataSource = new MatTableDataSource<DocumentData>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef;
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
  constructor(private api: CommonService, private route: ActivatedRoute, private formBuilder: FormBuilder, public dialog: MatDialog, private datePipe: DatePipe, private sweetlalert: SweetalertService,) {
    this.form = this.buildForm();
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.getDocumentDetails();
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
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.pattern(`^[a-zA-Z0-9 $-]+$`)]],
      expiryDate: [''],
      remarks: [''],
      personId: ['', Validators.required],
      file: ['']
    })
  }

  get documentNumberControl() {
    return this.form.get('documentNumber');
  }

  getStatusLabel(status: number): string {
    const grade = this.documentTypeenum.find(Address => Address.value === status);
    return grade ? grade.label : 'Unknown';
  }

  onSelectedFile(e) {
    const file = e.target.files[0]
    this.File = file;
    this.imagePath = null;
  }

  downloadFile(text) {
    saveAs(this.attachmentUrl + text.path.replace('wwwroot\\', ''), text.path.replace('wwwroot\\', '') );
  };

  Save() {
    this.form.get("personId").setValue(this.requestId) 
    this.form.removeControl('id')
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.form.valid) {

      const formattedExpiryDate = this.datePipe.transform(this.form?.value?.expiryDate, 'yyyy-MM-dd');
      this.form.patchValue({ expiryDate: formattedExpiryDate });

      if (this.documentId) {

        this.form.addControl("id", this.formBuilder.control('', Validators.required));
        this.form.get("id").setValue(this.documentId)
        if (this.File) {
          this.form.get("file").setValue(this.File);
        } else {
          this.form.get("file").setValue(this.imagePath);
        }
        const formData: FormData = new FormData();
        formData.append('documentType', this.form.get('documentType').value);
        formData.append('documentNumber', this.form.get('documentNumber').value); 
        if (this.File) {
          formData.append('file', this.File);
        } else if (!this.File && this.imagePath) {
          formData.append('file', this.imagePath);
        }
  
        
        this.form.get('expiryDate').value ? formData.append('expiryDate', this.form.get('expiryDate').value) : '';
        formData.append('remarks', this.form.get('remarks').value);
        formData.append('id', this.form.get('id').value);
        formData.append('personId', this.form.get('personId').value);
        this.api.put(`Document`, formData).subscribe((res) => {

          if (res) {
            this.api.showToast('Document updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.getDocumentDetails();
            this.isForm = false;
            this.form.reset()
            this.File = null;
          }
        }, (err) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        })
      } else {
        this.form.get("file")?.setValue(this.File)
        this.form.get('expiryDate').patchValue(this.datePipe.transform(this.form.value.expiryDate, "YYYY-MM-dd"));
        const formData: FormData = new FormData();
        formData.append('documentType', this.form.get('documentType').value);
        formData.append('documentNumber', this.form.get('documentNumber').value);
        formData.append('file', this.form.get('file').value);
        this.form.get('expiryDate').value ? formData.append('expiryDate', this.form.get('expiryDate').value) : '';
        formData.append('remarks', this.form.get('remarks').value);
        formData.append('personId', this.form.get('personId').value);
        this.api.post(`Document`, formData).subscribe((res) => {

          if (res) {
            this.api.showToast('Document saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
            this.isSubmitting = false
            this.getDocumentDetails();
            this.isForm = false;
            this.form.reset()
            this.File = null;
          }
        }, (err) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        })
      }
      this.fileInput.nativeElement.value = '';
    } else {
      this.form.markAllAsTouched();
    }
  }

  getDocumentDetails() {
    this.api.get(`Person/${this.requestId}/document`).subscribe((res) => {
      return this.dataSource.data = res;
    })
  }

  async deleteDocument(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`document/${element.id}`).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.api.showToast('Document deleted successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
      }, (error) => {
        this.api.showToast('Error while deleting document. Please try again later.', ToastType.ERROR, ToastType.ERROR);
      })
      this.dataSource.data;
    }
  }

  editDocument(element) {
    this.api.get(`document/${element?.id}`).subscribe((res) => {
      this.isForm = true;
      const pathname = res?.value?.path?.split('\\').pop();
      this.form.patchValue(res.value);
      const file = this.File;
      const updatedFile = new File([file], pathname,); 
      this.imagePath = res?.value?.path;
      this.File = null;
    })
    this.documentId = element.id;
  }

  addDocumentDetail() {
    this.documentId = null;
    this.isForm = true; 
  }

  cancle() {
    this.isForm = false;
    this.form.reset();
    this.File = null;
    this.fileInput.nativeElement.value = '';
  }
  trimNameOnBlur(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }

}
export interface DocumentData {
  documentType?: string,
  documentNumber?: string,
  expiryDate?: string,
  remarks?: string,
  id?: string
}
enum MyEnum {
  documentType = 'documentType',
  documentNumber = 'documentNumber',
  expiryDate = 'expiryDate',
  remarks = 'remarks',
  Actions = 'actions'
}

