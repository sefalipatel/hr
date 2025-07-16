import { ComponentFixture, TestBed } from '@angular/core/testing';

import AdminAttendanceViewComponent from './admin-attendance-view.component';

describe('AdminAttendanceViewComponent', () => {
  let component: AdminAttendanceViewComponent;
  let fixture: ComponentFixture<AdminAttendanceViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAttendanceViewComponent]
    });
    fixture = TestBed.createComponent(AdminAttendanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
