import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-poll-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, AngularEditorModule],
  templateUrl: './poll-form.component.html',
  styleUrls: ['./poll-form.component.scss']
})
export class PollFormComponent implements OnInit {
  public pollForm: FormGroup;
  public isView: boolean = false;
  public pollId: string;
  public getAllPollList: any;
  public departmentList: any;
  public minDate: Date;
  id: string = '';
  public allDepartmentValue: string = '00000000-0000-0000-0000-000000000000';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService) {
    this.pollForm = this.buildForm();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.route.params.subscribe(async (params) => {
      this.pollId = this.pollId ?? params['id'];
    })
    this.getAllDepartment();
    if (this.pollId) {
      this.getPollById();
    }
    this.minDate = new Date();
  }

  buildForm() {
    return this.formBuilder.group({
      title: ['', [Validators.required, this.noWhitespaceValidator.bind(this)]],
      departmentId: [''],
      endDate: ['', Validators.required],
      status: [1],
      pollChoices: this.formBuilder.array([this.createChoice(), this.createChoice()])
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

  private decodeHtmlEntities(input: string): string {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = input;
    return textArea.value; // this will decode the &#160; into regular spaces
  }
  private stripHtmlTags(input: string): string {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || ""; // Strip out all tags and return plain text
  }

  createChoice(): FormGroup {
    return this.formBuilder.group({
      choice: ['', [Validators.required, this.noWhitespaceValidator.bind(this)]]
    });
  }

  get pollChoices(): FormArray {
    return this.pollForm.get('pollChoices') as FormArray;
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d ? d >= today : false;
  };

  // Department list
  getAllDepartment() {
    this.commonService.get('Department').subscribe(res => {
      this.departmentList = res;
    })
  }

  // Add filed on "+" clisk
  addChoice(): void {
    this.pollChoices.push(this.createChoice());
  }

  // Remove filed on "-" clisk
  removeChoice(index: number): void {
    this.pollChoices.removeAt(index);
  }

  // Add and update
  onSubmit(): void {
    if (this.pollForm.invalid) {
      this.pollForm.markAllAsTouched();
      return
    }
    const formValue = { ...this.pollForm.value };
    let endDate = new Date(formValue.endDate);
    endDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())); // Normalize to UTC
    formValue.endDate = endDate.toISOString().split('T')[0]; 
    if (this.pollId) {
      const userId = JSON.parse(localStorage.getItem('userInfo')).personID;
      let payload = {
        ...formValue, 
        id: this.pollId,
        createdBy: userId
      }
      this.commonService.put('Poll', payload).subscribe(res => {
        if (res) {
          this.getPollDetails();
          this.onList();
          this.commonService.showToast('Poll updated successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        }
      })
    } else {
      this.commonService.post('Poll', formValue).subscribe(res => {
        if (res) {
          this.getPollDetails();
          this.onList();
          this.pollForm.reset();
          this.commonService.showToast('Poll added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        }
      })
    }
  }

  // Set value of poll id into filed
  getPollById() {
    this.commonService.get(`Poll/${this.pollId}`).subscribe(res => {
      this.pollForm.patchValue(res);
      this.pollChoices.clear();
      res.pollChoices.forEach(choice => {
        this.pollChoices.push(this.formBuilder.group({
          choice: [choice.choice, [Validators.required, this.noWhitespaceValidator.bind(this)]]
        }));
      });
    })
  }

  // All poll list
  getPollDetails() {
    this.commonService.get('Poll').subscribe(res => {
      this.getAllPollList = res;
    })
  }

  onList() {
    this.router.navigate(['admin/poll-list']);
  }
  trimNameOnBlur(controlName: string) {
    const control = this.pollForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

}
