import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShiftScheduleFormComponent } from './user-shift-schedule-form.component';

describe('UserShiftScheduleFormComponent', () => {
  let component: UserShiftScheduleFormComponent;
  let fixture: ComponentFixture<UserShiftScheduleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserShiftScheduleFormComponent]
    });
    fixture = TestBed.createComponent(UserShiftScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
