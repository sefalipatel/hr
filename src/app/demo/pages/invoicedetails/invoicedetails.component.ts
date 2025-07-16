import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ApiService } from 'src/app/api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'primeng/api';
import { MatInputModule } from '@angular/material/input';
import { ToastType } from 'src/app/service/common/common.model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-invoicedetails',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
  ],
  templateUrl: './invoicedetails.component.html',
  styleUrls: ['./invoicedetails.component.scss']
})
export class InvoicedetailsComponent {
  InvoiceForm: FormGroup;
  isView?: boolean;
  baseURL?: any = environment.apiUrl;
  selectiontype: any;
  File: File | undefined;
  ProjectList: any[] = [];
  documentId: string;
  providers: [DatePipe];
  isForm?: boolean = false;
  isSubmitting : boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
    private apiService: ApiService,
    private route: Router,
    private api: CommonService,
    private datePipe: DatePipe,
    private Activatedroute: ActivatedRoute
  ) {
    this.InvoiceForm = this.buildForm();
  }
  buildForm() {
    return this._fb.group({
      id: [''],
      invoiceDate: ['', [Validators.required]],
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.pattern(`^\\d*\\.?\\d+$`)]],
      projectId: ['', Validators.required],
      status: [0],
      file: [null],
      invoice: [null]
    });
  }
  selectionchange(data) {
    this.selectiontype = data.value;
  }
  ngOnInit(): void {
    this.Activatedroute.params.subscribe(async (params) => {
      this.documentId = this.documentId ?? params['id'];
    });
    if (this.documentId) {
      this.getInvoiceDetails();
    }
    this.apiService.getProjectDetails().then((data) => {
      this.ProjectList = data;
    });
  }
  onList() {
    this.router.navigate(['/invoice-details']);
  }
  selectedFile: File | null | any = null;

  onSelectedFile(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
  
      this.InvoiceForm.patchValue({
        file: this.selectedFile,
      });
  
      this.InvoiceForm.get('file').updateValueAndValidity();
    }
  }
  
  removeFile() {
    this.selectedFile = null;
    this.File = null;
    this.InvoiceForm.controls['file'].setValue(null);
  }
   
  getInvoiceDetails() {
    this.api.get(`Invoice/${this.documentId}`).subscribe((res) => {
      if (res?.value) {
        this.InvoiceForm.patchValue(res.value);
  
        if (res.value.invoice) {
          this.File = res.value.invoice; // Store the file path from API
          this.selectedFile = null; // Clear selected file if editing
        } else {
          this.File = null;
          this.selectedFile = null;
        }
      }
    });
  }
  
  getFileUrl(): string {
    return this.File ? `${this.baseURL}/${this.File}` : '';
  }
  getFileName(filePath: any): any {
    return filePath ? filePath.split('\\').pop() || filePath.split('/').pop() || filePath : 'Unknown File';
  }
  Save() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.InvoiceForm.invalid) {
      this.InvoiceForm.markAllAsTouched();
      return;
    }
  
    const formattedInvoiceDate = this.datePipe.transform(this.InvoiceForm.value.invoiceDate, 'yyyy-MM-dd');
    this.InvoiceForm.patchValue({ invoiceDate: formattedInvoiceDate });
  
    const formData: FormData = new FormData();
    Object.keys(this.InvoiceForm.controls).forEach(key => {
      const value = this.InvoiceForm.get(key)?.value;
   
      if (key === 'file' && value instanceof File) {
        formData.append(key, value);
      }
      else if (key !== 'id' || this.documentId) {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });
  
    const apiCall = this.documentId ? this.api.put('invoice', formData) : this.api.post('Invoice', formData);
    apiCall.subscribe(res => {
      if (res) {
         this.api.showToast(`Invoice ${this.documentId ? 'Updated' : 'Saved'} Successfully.`, ToastType.SUCCESS, ToastType.SUCCESS);
         this.isSubmitting = false
        this.route.navigate(['/invoice-details']);
        this.isForm = false;
        this.InvoiceForm.reset();
        this.selectedFile = null;
      }
    }, (err) => {
      this.api.showToast(`Something went wrong.`, ToastType.ERROR, ToastType.ERROR);

    });
  
    this.fileInput.nativeElement.value = ''; 
  }

  trimNameOnBlur(controlName: string) {
    const control = this.InvoiceForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

}
