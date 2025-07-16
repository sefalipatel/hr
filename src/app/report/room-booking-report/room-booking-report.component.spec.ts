import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBookingReportComponent } from './room-booking-report.component';

describe('RoomBookingReportComponent', () => {
  let component: RoomBookingReportComponent;
  let fixture: ComponentFixture<RoomBookingReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomBookingReportComponent]
    });
    fixture = TestBed.createComponent(RoomBookingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
