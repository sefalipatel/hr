import { ComponentFixture, TestBed } from '@angular/core/testing';

import  UserHolidayComponent  from './user-holiday.component';

describe('UserHolidayComponent', () => {
  let component: UserHolidayComponent;
  let fixture: ComponentFixture<UserHolidayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserHolidayComponent]
    });
    fixture = TestBed.createComponent(UserHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
