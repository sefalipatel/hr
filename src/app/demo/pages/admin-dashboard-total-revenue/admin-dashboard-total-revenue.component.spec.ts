import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardTotalRevenueComponent } from './admin-dashboard-total-revenue.component';

describe('AdminDashboardTotalRevenueComponent', () => {
  let component: AdminDashboardTotalRevenueComponent;
  let fixture: ComponentFixture<AdminDashboardTotalRevenueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardTotalRevenueComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardTotalRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
