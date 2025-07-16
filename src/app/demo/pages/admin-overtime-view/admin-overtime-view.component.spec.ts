import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOvertimeViewComponent } from './admin-overtime-view.component';

describe('AdminOvertimeViewComponent', () => {
  let component: AdminOvertimeViewComponent;
  let fixture: ComponentFixture<AdminOvertimeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminOvertimeViewComponent]
    });
    fixture = TestBed.createComponent(AdminOvertimeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
