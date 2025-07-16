import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardEmployeeComponent } from './admin-dashboard-employee.component';

describe('AdminDashboardEmployeeComponent', () => {
  let component: AdminDashboardEmployeeComponent;
  let fixture: ComponentFixture<AdminDashboardEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardEmployeeComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
