import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ToastType } from 'src/app/service/common/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ApiService } from 'src/app/api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
@Component({
  selector: 'app-broadcast-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule,
    ReactiveFormsModule, AngularEditorModule],
  templateUrl: './broadcast-form.component.html',
  styleUrls: ['./broadcast-form.component.scss']
})


export class BroadcastFormComponent {
  BroadcastForm: FormGroup;
  buttonName: string = "Save";
  id: string = '';
  providers: [DatePipe];
  isView?: boolean;
  public AddbraodcastId!: string;
  isAddbraodcast: boolean = true;
  isSubmitting: boolean = false
  filteredSubTypeData: any[] = [];
  visitorSubTypeData: any[] = [];
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
    this.BroadcastForm = this.buildForm();
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
  buildForm() {
    return this._fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required,  this.noWhitespaceValidator.bind(this)]],
      isActive: [true],
      startDate: ['',],
      endDate: [''],
      organizationId: localStorage.getItem('orgId'),
    });
  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.AddbraodcastId = this.activeRoute.snapshot.paramMap.get('id') ?? '';
    this.isAddbraodcast = this.AddbraodcastId ? false : true
    this.gettBroadcastId(this.AddbraodcastId);

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
  
  onList() {
    this.router.navigate(['/broadcast'])
  }
  gettBroadcastId(id: string) {
    this._commonService.get(`${'Broadcast'}/${id}`).subscribe((res) => {
      if (res.statusCode == 200) {
        if (res) {
          this.filteredSubType(res.value);
        }
        this.BroadcastForm.patchValue(res.value);
      }
    });
  }
  filteredSubType(visitorTypeId: string) {
    let filteredSubType = this.visitorSubTypeData.filter(res => res.visitorTypeId === visitorTypeId)
    this.filteredSubTypeData = filteredSubType;
  }
  Save() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    const formattedDate = this.datePipe.transform(this.BroadcastForm.value.startDate, 'yyyy-MM-ddTHH:mm:ss');
    const formattedEndDate = this.BroadcastForm.value.endDate
      ? this.datePipe.transform(this.BroadcastForm.value.endDate, 'yyyy-MM-ddTHH:mm:ss')
      : null;

    if (this.BroadcastForm.invalid) {
      this.BroadcastForm.markAllAsTouched();
      return;
    }
   
    this.BroadcastForm.patchValue({ startDate: formattedDate, endDate: formattedEndDate });
    if (this.isAddbraodcast) {
      this._commonService.post('Broadcast', this.BroadcastForm.value).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast(' Broadcast added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/broadcast']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      this._commonService.put('Broadcast', { id: this.AddbraodcastId, name: this.BroadcastForm.value.name, description: this.BroadcastForm.value.description, startDate: this.BroadcastForm.value.startDate, endDate: this.BroadcastForm.value.endDate, organizationId: localStorage.getItem('orgId'), isActive: this.BroadcastForm.value.isActive }).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Broadcast updated successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/broadcast']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.BroadcastForm.get(controlName);
    if (control?.value) {
      let trimmedValue = control.value.replace(/(<([^>]+)>)/gi, '').trim(); // Remove HTML & trim spaces
      control.setValue(trimmedValue, { emitEvent: false });
      control.updateValueAndValidity(); // Revalidate
    }
  }
  

}
