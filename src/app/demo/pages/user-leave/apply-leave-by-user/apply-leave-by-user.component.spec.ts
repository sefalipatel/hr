import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLeaveByUserComponent } from './apply-leave-by-user.component';

describe('ApplyLeaveByUserComponent', () => {
  let component: ApplyLeaveByUserComponent;
  let fixture: ComponentFixture<ApplyLeaveByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApplyLeaveByUserComponent]
    });
    fixture = TestBed.createComponent(ApplyLeaveByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
