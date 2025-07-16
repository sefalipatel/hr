import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AngularEditorComponent, AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ToastType } from 'src/app/demo/models/models';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-template-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, AngularEditorModule],
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDetailComponent {
  isSubTypeAdd: boolean = false;
  subTypeForm: FormGroup;
  subTypeId: string = ''
  public templateIdToEdit!: string;
  isVerified: boolean = true;
  isView?: boolean;
  filteredSubTypeData: any[] = [];
  visitorSubTypeData: any[] = [];
  public getById:any;
  templateDetail : any;
  id: string = '';
  isSubmitting : boolean = false
  public paySlipFields: string[] = [
    'Name',
    'Code',
    'UAN',
    'Payslipformonth',
    'Department',
    'Designation',
    'Joining Date',
    'BirthDate',
    'actualSalary',
    'paidSalary',
    'Days Paid',
    'Days Present',
    'Absent',
    'Paid Off',
    'PaidLeave',
    'W.Off',
    'CompOff',
    'Net Pay',
    'earningRows',
    'TotalEarning',
    'deductionRows',
    'TotalDeduction',
    'CompanyLogo',
    'OrganizationName',
    'Net Pay in Words'
  ];
  
  @ViewChild(AngularEditorComponent) editor: AngularEditorComponent;
  constructor( 
    private route: Router,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private _commonService: CommonService,
    private _fb: FormBuilder
  ) {

    this.subTypeForm = this._fb.group({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]],
      OrganizationId: [localStorage.getItem('orgId')]
    })
    this.templateIdToEdit = this.activeRoute.snapshot.paramMap.get('id') ?? '';
    this.isSubTypeAdd = this.templateIdToEdit ? false : true 

  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.gettemplateById(this.templateIdToEdit);
  }

  get f() {
    return this.subTypeForm.controls;
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
  reset() {
    this.subTypeForm.reset();
    this.isSubTypeAdd = false;
    this.subTypeId = '';
  } 
  saveTemplate() {

    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.subTypeForm.invalid) {
      this.subTypeForm.markAllAsTouched();
      return;
    }
    if (this.isSubTypeAdd) {
      this._commonService.post('Template', this.subTypeForm.value).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast('Template Added Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/system-template-details']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    } else {
      this._commonService.put('Template', { id: this.templateIdToEdit, name: this.templateDetail.name, OrganizationId: this.subTypeForm.value.OrganizationId, subject: this.subTypeForm.value.subject, body: this.subTypeForm.value.body, }).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Template Updated Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/system-template-details']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  gettemplateById(id: string) {
    this.getById = id;

    // Optionally, disable the field programmatically for more control
    if (this.getById) {
      this.subTypeForm.controls['name'].disable();
    } else {
      this.subTypeForm.controls['name'].enable();
    }
    this._commonService.get(`${'Template'}/${id}`).subscribe((res) => {
      if (res?.statusCode == 200) {
        if (res?.value) {
          this.templateDetail = res?.value;
          this.filteredSubType(res?.value);
        } 
        this.subTypeForm.patchValue(res?.value);
      } 
    });
  }
  filteredSubType(visitorTypeId: string) {
    let filteredSubType = this.visitorSubTypeData.filter(res => res.visitorTypeId === visitorTypeId)
    this.filteredSubTypeData = filteredSubType; 
  }

  trimNameOnBlur(controlName: string) {
    const control = this.subTypeForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  navigate = function () {
    this.router.navigateByUrl('/system-template-details');
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

  insertTextAdvanced(text: string): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
  
    const range = sel.getRangeAt(0);
    range.deleteContents();
  
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
  
    // Move the caret after the inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  insertSnippet(event: any): void {
    const snippet = event.target.value;
    if (!snippet) return;
  
    // Ensure editor is focused
    this.editor?.focus();
  
    // Insert at cursor
    document.execCommand('insertText', false, snippet);
  
    // Optional: Reset dropdown
    event.target.selectedIndex = 0;
  }

}
