import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftScheduleListComponent } from './shift-schedule-list.component';

describe('ShiftScheduleListComponent', () => {
  let component: ShiftScheduleListComponent;
  let fixture: ComponentFixture<ShiftScheduleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShiftScheduleListComponent]
    });
    fixture = TestBed.createComponent(ShiftScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
