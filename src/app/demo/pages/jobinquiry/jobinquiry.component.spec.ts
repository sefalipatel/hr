import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobinquiryComponent } from './jobinquiry.component';

describe('JobinquiryComponent', () => {
  let component: JobinquiryComponent;
  let fixture: ComponentFixture<JobinquiryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobinquiryComponent]
    });
    fixture = TestBed.createComponent(JobinquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
