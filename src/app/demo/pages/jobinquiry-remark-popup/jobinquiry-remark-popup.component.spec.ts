import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobinquiryRemarkPopupComponent } from './jobinquiry-remark-popup.component';

describe('JobinquiryRemarkPopupComponent', () => {
  let component: JobinquiryRemarkPopupComponent;
  let fixture: ComponentFixture<JobinquiryRemarkPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobinquiryRemarkPopupComponent]
    });
    fixture = TestBed.createComponent(JobinquiryRemarkPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
