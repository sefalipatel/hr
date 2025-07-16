import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardInvoicesComponent } from './admin-dashboard-invoices.component';

describe('AdminDashboardInvoicesComponent', () => {
  let component: AdminDashboardInvoicesComponent;
  let fixture: ComponentFixture<AdminDashboardInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardInvoicesComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
