import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplyLeaveComponent } from './new-apply-leave.component';

describe('NewApplyLeaveComponent', () => {
  let component: NewApplyLeaveComponent;
  let fixture: ComponentFixture<NewApplyLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewApplyLeaveComponent]
    });
    fixture = TestBed.createComponent(NewApplyLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
