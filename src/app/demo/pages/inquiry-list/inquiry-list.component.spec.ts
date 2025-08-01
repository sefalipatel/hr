import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryListComponent } from './inquiry-list.component';

describe('InquiryListComponent', () => {
  let component: InquiryListComponent;
  let fixture: ComponentFixture<InquiryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InquiryListComponent]
    });
    fixture = TestBed.createComponent(InquiryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
