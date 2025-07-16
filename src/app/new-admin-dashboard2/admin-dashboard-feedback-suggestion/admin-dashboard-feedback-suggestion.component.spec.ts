import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardFeedbackSuggestionComponent } from './admin-dashboard-feedback-suggestion.component';

describe('AdminDashboardFeedbackSuggestionComponent', () => {
  let component: AdminDashboardFeedbackSuggestionComponent;
  let fixture: ComponentFixture<AdminDashboardFeedbackSuggestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardFeedbackSuggestionComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardFeedbackSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
