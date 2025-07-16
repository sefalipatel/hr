import { ComponentFixture, TestBed } from '@angular/core/testing';

import TimeSheetAdminComponent  from './time-sheet-admin.component';

describe('TimeSheetAdminComponent', () => {
  let component: TimeSheetAdminComponent;
  let fixture: ComponentFixture<TimeSheetAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimeSheetAdminComponent]
    });
    fixture = TestBed.createComponent(TimeSheetAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
