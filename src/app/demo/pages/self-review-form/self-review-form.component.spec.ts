import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfReviewFormComponent } from './self-review-form.component';

describe('SelfReviewFormComponent', () => {
  let component: SelfReviewFormComponent;
  let fixture: ComponentFixture<SelfReviewFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelfReviewFormComponent]
    });
    fixture = TestBed.createComponent(SelfReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
