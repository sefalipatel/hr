import { ComponentFixture, TestBed } from '@angular/core/testing';

import  TimeSheetDateWiseComponent from './time-sheet-date-wise.component';

describe('TimeSheetDateWiseComponent', () => {
  let component: TimeSheetDateWiseComponent;
  let fixture: ComponentFixture<TimeSheetDateWiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSheetDateWiseComponent]
    });
    fixture = TestBed.createComponent(TimeSheetDateWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
