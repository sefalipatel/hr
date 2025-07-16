import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardCompanyShiftComponent } from './admin-dashboard-company-shift.component';

describe('AdminDashboardCompanyShiftComponent', () => {
  let component: AdminDashboardCompanyShiftComponent;
  let fixture: ComponentFixture<AdminDashboardCompanyShiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardCompanyShiftComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardCompanyShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
