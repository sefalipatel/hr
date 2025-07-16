import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-client-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatTabsModule],
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})
export class ClientProjectComponent {
  clientForm: FormGroup;
  title: string = "Add Project";
  buttonName: string = "Save";
  onlyFileType = ".png, .jpg, .jpeg, .pdf , .docx , .doc , .xlsx";
  selectedFiles: File[];
  filelist: any = [];
  uploadedFiles = [];
  uploadfilelist: any = [];
  deletefile: any = [];
  id: string = '';
  isView ? : boolean;
  isSubmitting : boolean = false;

  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private apiService: ApiService, private api: CommonService, private sweetlalert: SweetalertService) {
    this.clientForm = this._fb.group({
      clientName: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[A-Za-z\s.'-]+$/)]],
      clientContactNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern("^[0-9]{10,13}")]],
      clientEmail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      externalStakeholders: ['', Validators.required], 

    })
  }
  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getByIdAllData()
  }

  getByIdAllData() {
    this.api.get(`Client/${this.id}`).subscribe((x) => {
      this.clientForm.patchValue(x.value)
    })
  }
  cancel() {
    this.router.navigate(['client-list'])
  }
  navigate() {
    this.router.navigateByUrl('/client-list');
  }

  createClient() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
  
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }
  
    const payload = this.id ? { id: this.id, ...this.clientForm.value } : this.clientForm.value;
    const apiCall = this.id ? this.api.put(`Client`, payload) : this.api.post(`Client`, payload);
  
    apiCall.subscribe(
      (x) => {
        if (x?.statusCode === 200) {
          const message = this.id ? 'Client updated successfully.' : 'Client added successfully.';
          this.api.showToast(message, ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
          this.router.navigate(['client-list']);
        } else if (x?.errors?.[0]?.errorMessage === "Duplicate Email") {
          this.api.showToast('Email already exists.', ToastType.ERROR, ToastType.ERROR);
          this.isSubmitting = false;
        }
      },
      (error) => {
        this.handleBackendErrors(error);
      }
    );
  }
  handleBackendErrors(error) {
    this.isSubmitting = false;
  
    if (error.error?.errors?.ContactNumber) {
      const backendError = error.error.errors.ContactNumber[0]; // Get the first error message
      this.api.showToast(backendError, ToastType.ERROR, ToastType.ERROR);
    } else if (error.error?.errors?.Email) {
      const backendError = error.error.errors.Email[0]; // Handle email errors
      this.api.showToast(backendError, ToastType.ERROR, ToastType.ERROR);
    } else {
      this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
    }
  }
    
  trimNameOnBlur(controlName: string) {
    const control = this.clientForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}

