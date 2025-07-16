import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRemarkComponent } from './feedback-remark.component';

describe('FeedbackRemarkComponent', () => {
  let component: FeedbackRemarkComponent;
  let fixture: ComponentFixture<FeedbackRemarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackRemarkComponent]
    });
    fixture = TestBed.createComponent(FeedbackRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
