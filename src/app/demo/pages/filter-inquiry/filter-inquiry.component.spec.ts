import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterInquiryComponent } from './filter-inquiry.component';

describe('FilterInquiryComponent', () => {
  let component: FilterInquiryComponent;
  let fixture: ComponentFixture<FilterInquiryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterInquiryComponent]
    });
    fixture = TestBed.createComponent(FilterInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
