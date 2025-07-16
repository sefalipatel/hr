import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProjectsComponent } from './dashboard-projects.component';

describe('DashboardProjectsComponent', () => {
  let component: DashboardProjectsComponent;
  let fixture: ComponentFixture<DashboardProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardProjectsComponent]
    });
    fixture = TestBed.createComponent(DashboardProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
