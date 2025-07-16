import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from 'src/app/api.service';
import { log } from 'console';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { LoaderComponent } from "../../../loader/loader.component";
@Component({
  selector: 'app-companypolicydetails',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, AngularEditorModule, LoaderComponent],
  templateUrl: './companypolicydetails.component.html',
  styleUrls: ['./companypolicydetails.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompanypolicydetailsComponent {
  CompanypolicyForm: FormGroup;
  isAddcompanypolicy: boolean = true;
  public AddcompanypolicyId!: string;
  filteredSubTypeData: any[] = [];
  visitorSubTypeData: any[] = [];
  companypolicytypeList: any[] = [];
  selectiontype: any;
  loading: boolean = false
  isSubmitting: boolean = false;
  id: string = '';
  constructor(private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
    private apiService: ApiService,
    private route: Router,) {
    this.CompanypolicyForm = this.buildForm(); 
  }
  buildForm() {
    return this._fb.group({
      name: ['', [Validators.required]],
      policyTypeId: ['', [Validators.required]],
      description: ['', [Validators.required, this.noWhitespaceValidator.bind(this)]], 
      isActive: [true]
    })
  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.AddcompanypolicyId = this.activeRoute.snapshot.paramMap.get('id') ?? '';
    this.isAddcompanypolicy = this.AddcompanypolicyId ? false : true
    this.gettcompanypolicyId(this.AddcompanypolicyId);
    this.apiService.getcompanypolicytype().then((data) => {
      this.companypolicytypeList = data;
    });
  }

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
  gettcompanypolicyId(id: string) {
    this._commonService.get(`${'CompanyPolicy'}/${id}`).subscribe((res) => {
      if (res) {
        if (res) {
          this.filteredSubType(res);
        }
        this.CompanypolicyForm.patchValue(res);
      }
    });
  }
  filteredSubType(visitorTypeId: string) {
    let filteredSubType = this.visitorSubTypeData.filter(res => res.visitorTypeId === visitorTypeId)
    this.filteredSubTypeData = filteredSubType;
  }
  Addcompanypolicy() {
    this.loading = true
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true
    if (this.CompanypolicyForm.invalid) {
      this.CompanypolicyForm.markAllAsTouched();
      return;
    }
    if (this.isAddcompanypolicy) {
      this._commonService.post('CompanyPolicy', this.CompanypolicyForm.value).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast('CompanyPolicy added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.loading = false
          this.route.navigate(['/company-policy-details']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      this._commonService.put('CompanyPolicy', { id: this.AddcompanypolicyId, name: this.CompanypolicyForm.value.name, policyTypeId: this.CompanypolicyForm.value.policyTypeId, description: this.CompanypolicyForm.value.description, isActive: true }).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Companypolicy updated successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.loading = false
          this.route.navigate(['/company-policy-details']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  onList() {
    this.router.navigate(['/company-policy-details'])
  }
  selectionchange(data) {
    this.selectiontype = data.value
  }

  trimNameOnBlur(controlName: string) {
    const control = this.CompanypolicyForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

}
