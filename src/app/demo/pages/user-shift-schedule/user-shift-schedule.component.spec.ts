import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShiftScheduleComponent } from './user-shift-schedule.component';

describe('UserShiftScheduleComponent', () => {
  let component: UserShiftScheduleComponent;
  let fixture: ComponentFixture<UserShiftScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserShiftScheduleComponent]
    });
    fixture = TestBed.createComponent(UserShiftScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
