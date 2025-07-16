import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { Department, ToastType } from 'src/app/service/common/common.model';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-questiontype-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule,
    ReactiveFormsModule, AngularEditorModule, MatSelectModule],
  templateUrl: './questiontype-form.component.html',
  styleUrls: ['./questiontype-form.component.scss']
})
export class QuestiontypeFormComponent {
  questionForm: FormGroup;
  isView?: boolean;
  Department: Array<Department> = [];
  public AddquestionId!: string;
  isquestion: boolean = true;
  filteredSubTypeData: any[] = [];
  visitorSubTypeData: any[] = [];
  id: string = '';
  isSubmitting : boolean = false;
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private api: CommonService,
    private route: Router,
    private _commonService: CommonService,
    private activeRoute: ActivatedRoute,) {
    this.questionForm = this.buildForm();

  }
  buildForm() {
    return this._fb.group({
      questions: ['',[Validators.required]],
      questionType: ['',[Validators.required]],
      isActive: [true],
      departmentId: ['',[Validators.required]],
    });
  }
  questiontype = [
    { value: 0, status: 'Text' },
    { value: 1, status: 'Multichoice' }
  ];
  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.AddquestionId = this.activeRoute.snapshot.paramMap.get('id') ?? '';
    this.isquestion = this.AddquestionId ? false : true
    this.getquestiontId(this.AddquestionId);
    this.api.get(`Department`).subscribe((response) => {
      this.Department = response
    })
  }
  getquestiontId(id: string) {
    this._commonService.get(`${'Question'}/${id}`).subscribe((res) => {
      if (res.statusCode == 200) {
        if (res) {
          this.filteredSubType(res.value);
        }
        this.questionForm.patchValue(res.value);
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
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }
    if (this.isquestion) {
      this._commonService.post('Question', this.questionForm.value).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast(' Question Added Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false;
          this.route.navigate(['/quetion']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      this._commonService.put('Question', { id: this.AddquestionId, questions: this.questionForm.value.questions, departmentId: this.questionForm.value.departmentId, questionType: this.questionForm.value.questionType, isActive: this.questionForm.value.isActive }).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Question Updated Successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/quetion']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  onList() {
    this.router.navigate(['/quetion'])
  }
  trimNameOnBlur(controlName: string) {
    const control = this.questionForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
