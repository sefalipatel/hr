import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSuggestionsComponent } from './feedback-suggestions.component';

describe('FeedbackSuggestionsComponent', () => {
  let component: FeedbackSuggestionsComponent;
  let fixture: ComponentFixture<FeedbackSuggestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackSuggestionsComponent]
    });
    fixture = TestBed.createComponent(FeedbackSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
