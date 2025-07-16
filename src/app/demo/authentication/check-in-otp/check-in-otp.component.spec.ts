import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInOtpComponent } from './check-in-otp.component';

describe('CheckInOtpComponent', () => {
  let component: CheckInOtpComponent;
  let fixture: ComponentFixture<CheckInOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckInOtpComponent]
    });
    fixture = TestBed.createComponent(CheckInOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
