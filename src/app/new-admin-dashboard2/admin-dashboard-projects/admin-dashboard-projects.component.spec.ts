import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardProjectsComponent } from './admin-dashboard-projects.component';

describe('AdminDashboardProjectsComponent', () => {
  let component: AdminDashboardProjectsComponent;
  let fixture: ComponentFixture<AdminDashboardProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardProjectsComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
