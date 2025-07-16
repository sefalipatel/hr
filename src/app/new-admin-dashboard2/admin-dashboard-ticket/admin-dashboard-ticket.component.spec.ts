import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardTicketComponent } from './admin-dashboard-ticket.component';

describe('AdminDashboardTicketComponent', () => {
  let component: AdminDashboardTicketComponent;
  let fixture: ComponentFixture<AdminDashboardTicketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardTicketComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
