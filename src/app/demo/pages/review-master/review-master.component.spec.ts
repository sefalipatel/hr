import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMasterComponent } from './review-master.component';

describe('ReviewMasterComponent', () => {
  let component: ReviewMasterComponent;
  let fixture: ComponentFixture<ReviewMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewMasterComponent]
    });
    fixture = TestBed.createComponent(ReviewMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
