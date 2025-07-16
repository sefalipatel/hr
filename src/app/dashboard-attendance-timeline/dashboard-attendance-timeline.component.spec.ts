import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAttendanceTimelineComponent } from './dashboard-attendance-timeline.component';

describe('DashboardAttendanceTimelineComponent', () => {
  let component: DashboardAttendanceTimelineComponent;
  let fixture: ComponentFixture<DashboardAttendanceTimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardAttendanceTimelineComponent]
    });
    fixture = TestBed.createComponent(DashboardAttendanceTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
