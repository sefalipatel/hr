import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardClientComponent } from './admin-dashboard-client.component';

describe('AdminDashboardClientComponent', () => {
  let component: AdminDashboardClientComponent;
  let fixture: ComponentFixture<AdminDashboardClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardClientComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
