import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAttendanceViewComponent } from './dashboard-attendance-view.component';

describe('DashboardAttendanceViewComponent', () => {
  let component: DashboardAttendanceViewComponent;
  let fixture: ComponentFixture<DashboardAttendanceViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardAttendanceViewComponent]
    });
    fixture = TestBed.createComponent(DashboardAttendanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
