import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor'
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { LoaderComponent } from "../../../loader/loader.component";
@Component({
  selector: 'app-companyprofile-form',
  standalone: true,
  imports: [CommonModule, MatButtonModule, SharedModule, AngularEditorModule, LoaderComponent],
  templateUrl: './companyprofile-form.component.html',
  styleUrls: ['./companyprofile-form.component.scss']
})
export class CompanyprofileFormComponent {
  CompanyprofileForm: FormGroup;
  loading: boolean = false
  companyprofile: any;
  organizationId: any;
  isAddcompanypolicy: boolean = true;
  id: string
  spaceRegex = /\s+/g;
  constructor(private _fb: FormBuilder,
    private _commonService: CommonService,
    private router: Router,
    private apiService: ApiService,
  ) {
    this.CompanyprofileForm = this.buildForm();
  }

  ngOnInit(): void {
    this.getcomapnyprofile();
  }
  buildForm() {
    return this._fb.group({
      detail: ['',[Validators.required, this.noWhitespaceValidator.bind(this)]],
    })
  }


  getcomapnyprofile() {
    this.loading = true
    this.apiService.getcompanyprofile().then((data) => {
      this.loading = false
      this.companyprofile = data;
      this.CompanyprofileForm.patchValue(data)
    });
  }

  Addcompanyprofile() {
    if (this.CompanyprofileForm.invalid) {
      this.CompanyprofileForm.markAllAsTouched();
      return;
    }
    let payload = {
      organizationId: localStorage.getItem('orgId'),
      ...this.CompanyprofileForm.value
    }
    if (this.companyprofile) {
      payload = {
        ...payload, id: this.companyprofile.id
      }
    }
    if (this.CompanyprofileForm.valid) {
      this._commonService.post('OrganizationProfile', payload).subscribe((res) => {
        if (res) {
          this._commonService.showToast(' Company profile added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }

  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  noWhitespaceValidator(control: AbstractControl) {
    let value = control.value ? control.value : ''; 
    
    value = this.decodeHtmlEntities(value);

    // Remove all HTML tags
    value = this.stripHtmlTags(value);
    value = value.replace(/\s+/g, ' ').trim();
    
    if (value === '') {
      return { whitespace: true }; // Return 'whitespace' error if input contains only spaces or invisible characters
    }
    return null; // No error if input is not just spaces or invisible characters
  }

  // Function to decode HTML entities like &#160; into normal characters
  private decodeHtmlEntities(input: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = input;
    return textArea.value; // this will decode the &#160; into regular spaces
  }

  // Function to remove HTML tags
  private stripHtmlTags(input: string): string {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || ""; // Strip out all tags and return plain text
  }
}
