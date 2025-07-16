import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export enum ReviewType {
  Self = 0,
  Peer = 1,
  Management = 2
}
@Component({
  selector: 'app-self-review-form',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './self-review-form.component.html',
  styleUrls: ['./self-review-form.component.scss']
})
export class SelfReviewFormComponent implements OnDestroy {
  reviewId: String = '';
 userReviewForm: FormGroup;
  quetions: any[] = [];
  reviewDetail: any = null;
  userReviewId: string = '';
  reviewerId : any;
  userId : string;

  constructor(private route: ActivatedRoute,private _fb: FormBuilder, private api: CommonService,private router: Router) {
    this.userReviewForm = this.buildForm();
    this.reviewId = this.route.snapshot.paramMap.get('id') ?? '';
    this.userReviewId = JSON.parse(localStorage.getItem('selectedReview'))?.id
    this.userId = JSON.parse(localStorage.getItem('userInfo')).personID;
    if (this.reviewId && this.userReviewId)
      this.getReviewById();
  }

  buildForm() {
    return this._fb.group({})
  }
  public get userReviewFormControl() {
    return this.userReviewForm.controls;
  }

  getReviewTypeName(type: number): string {
    return ReviewType[type];
  }

  getReviewById() {
    this.quetions = [];
    this.reviewDetail = null;
    this.api.get(`UserReviewDetail/userReview/${this.reviewId}/${this.userReviewId}`).subscribe(res => {
      this.quetions = res?.questions;
      this.reviewDetail = res?.review;
      this.quetions.map((x,i) => {
        this.reviewerId = x.reviewerId;
        this.userReviewForm.addControl(`answer${i}`, new FormControl(x?.answers??''))
        return x;
      })
    })
  }

  submit() {
    let questionList = [];
    let answers = this.quetions.map((x, i) => {
      let obj: any = {
        ReviewQuestionId: x.reviewQuestionId,
        Answer: this.userReviewForm.value[`answer${i}`]
      }
      return obj;
    })
    let payload = {
      ReviewerId: this.reviewerId,
      UserId:this.userId,
      ReviewId: this.reviewId,
      QuestionAnswer: answers
    }
    this.api.post(`UserReviewDetail/AddReviewQueAns`, payload).subscribe(res => {
      this.router.navigate(['self-review']);
    })
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedReview')
  }
}
