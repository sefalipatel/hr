import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardExpencesComponent } from './admin-dashboard-expences.component';

describe('AdminDashboardExpencesComponent', () => {
  let component: AdminDashboardExpencesComponent;
  let fixture: ComponentFixture<AdminDashboardExpencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardExpencesComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardExpencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
