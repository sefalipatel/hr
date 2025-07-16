import { ComponentFixture, TestBed } from '@angular/core/testing';

import ApprovalfromPopUpComponent from './approvalfrom-pop-up.component';

describe('ApprovalfromPopUpComponent', () => {
  let component: ApprovalfromPopUpComponent;
  let fixture: ComponentFixture<ApprovalfromPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovalfromPopUpComponent]
    });
    fixture = TestBed.createComponent(ApprovalfromPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
