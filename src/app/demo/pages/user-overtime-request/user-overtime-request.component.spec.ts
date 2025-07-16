import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOvertimeRequestComponent } from './user-overtime-request.component';

describe('UserOvertimeRequestComponent', () => {
  let component: UserOvertimeRequestComponent;
  let fixture: ComponentFixture<UserOvertimeRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserOvertimeRequestComponent]
    });
    fixture = TestBed.createComponent(UserOvertimeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
