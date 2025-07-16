import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewQuestionComponent } from './review-question.component';

describe('ReviewQuestionComponent', () => {
  let component: ReviewQuestionComponent;
  let fixture: ComponentFixture<ReviewQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewQuestionComponent]
    });
    fixture = TestBed.createComponent(ReviewQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
