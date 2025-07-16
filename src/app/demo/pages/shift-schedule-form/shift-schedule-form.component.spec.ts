import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftScheduleFormComponent } from './shift-schedule-form.component';

describe('ShiftScheduleFormComponent', () => {
  let component: ShiftScheduleFormComponent;
  let fixture: ComponentFixture<ShiftScheduleFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShiftScheduleFormComponent]
    });
    fixture = TestBed.createComponent(ShiftScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
