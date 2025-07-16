import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAttendanceAndLeaveComponent } from './dashboard-attendance-and-leave.component';

describe('DashboardAttendanceAndLeaveComponent', () => {
  let component: DashboardAttendanceAndLeaveComponent;
  let fixture: ComponentFixture<DashboardAttendanceAndLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardAttendanceAndLeaveComponent]
    });
    fixture = TestBed.createComponent(DashboardAttendanceAndLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
