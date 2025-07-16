import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayOnLeaveComponent } from './today-on-leave.component';

describe('TodayOnLeaveComponent', () => {
  let component: TodayOnLeaveComponent;
  let fixture: ComponentFixture<TodayOnLeaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodayOnLeaveComponent]
    });
    fixture = TestBed.createComponent(TodayOnLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
