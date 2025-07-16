import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeaveBalanceComponent } from './new-leave-balance.component';

describe('NewLeaveBalanceComponent', () => {
  let component: NewLeaveBalanceComponent;
  let fixture: ComponentFixture<NewLeaveBalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewLeaveBalanceComponent]
    });
    fixture = TestBed.createComponent(NewLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
