import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

export enum ReviewType {
  Self = 0,
  Peer = 1,
  Management = 2
}

@Component({
  selector: 'app-review-question',
  standalone: true,
  imports: [CommonModule,MatInputModule, MatDatepickerModule, MatFormFieldModule,
    ReactiveFormsModule,MatSelectModule,FormsModule,SharedModule,MatNativeDateModule,MatCheckboxModule],
  templateUrl: './review-question.component.html',
  styleUrls: ['./review-question.component.scss']
})

export class ReviewQuestionComponent {
  reviewForm: FormGroup;
  DepartmentName: any;
  reviewDetail: any;
  questions: any[]=[];
  DepartmentID: any;
  isView?: boolean;
  isSubmitting : boolean = false
  
  minDate: Date;
  reviewTypes = [
    { value: ReviewType.Self, viewValue: 'Self' },
    { value: ReviewType.Peer, viewValue: 'Peer' },
    { value: ReviewType.Management, viewValue: 'Management' }
  ];
  public expireDate:any;
  public currentDate=new Date();
  public isDueDateExpired: boolean = false; 
  public reviewMasterId:any;
  constructor(private router: Router,
    private api:CommonService,private _fb: FormBuilder, private _activeRoute: ActivatedRoute,private datePipe: DatePipe) {
      this.reviewForm = this.buildForm();
      this.reviewId = this._activeRoute.snapshot.params['id'] ?? '';
      this.minDate = new Date();
      if (this.reviewId) {
        this.getRewiewDetailById();
      }
    }

  buildForm() {
    return this._fb.group({
      departmentId: ['',[Validators.required]],
      title: ['',[Validators.required]],
      type: ['',[Validators.required]],
      dueOn: ['',[Validators.required]],
      isActive: [true],
    });
  }

  ngOnInit() {
    this.getAllDepartment();
    this.DepartmentID = ''
    this._activeRoute.params.subscribe(async (params)=>{
      this.reviewMasterId=this.reviewMasterId ?? params['id'];
    })
  }
  
  getAllDepartment() {
    this.api.get(`Department`).subscribe((x) => {
      this.DepartmentName = x
    })
  }
  
  submit(){
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }   
    const formatdueOn = this.datePipe.transform(this.reviewForm.value.dueOn, 'yyyy-MM-ddTHH:mm:ss');
    this.reviewForm.patchValue({ dueOn: formatdueOn});
    let questionsId = this.questions.filter(x=>x.isSelected).map(q => q.id);
    let payload = {
      ...this.reviewForm.value,
      questionsId:questionsId
    }
    payload = this.reviewId ? {...payload,id:this.reviewId} : payload;
  
    this.api.post('Review',payload).subscribe(res => {
      this.api.showToast('Review added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      this.isSubmitting = false;
      this.router.navigate(['/employee-review-master-details'])      
    })
  
  }

  selected(departmentId){
    this.questions = [];
    if(departmentId){
      
      this.api.get(`Question/QuestionsByDepartment/${departmentId}`).subscribe(res => {
        this.questions = res.value.map(x => {
          x['isSelected'] = false;
          return x;
        });
        if(this.reviewDetail?.questions?.length){
          this.questions = res.value.map(x => {
            x['isSelected'] = this.reviewDetail?.questions.some(d=>d.id == x.id ) ? true : false;
            return x;
          });
        }
      })
    }
  }

  onList(){
    this.router.navigate(['/employee-review-master-details'])
  }
  public reviewQuestionForm: FormGroup;
  reviewId: string = '';


  getRewiewDetailById() {
    const currentDateAndTime=this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    this.api.get(`Review/ReviewByReviewId/${this.reviewId}`).subscribe(res => {
      this.reviewDetail = res;
      this.reviewForm.patchValue(res.review);
      this.selected(res?.review?.departmentId);
      const dueOnDate = res?.review?.dueOn;      
      if (dueOnDate <= currentDateAndTime) {
        this.isDueDateExpired = true;
      }
    })
  }
  
  trimNameOnBlur() {
    const control = this.reviewForm.get('title'); 
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
  
}
