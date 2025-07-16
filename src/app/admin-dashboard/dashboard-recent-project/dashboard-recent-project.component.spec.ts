import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRecentProjectComponent } from './dashboard-recent-project.component';

describe('DashboardRecentProjectComponent', () => {
  let component: DashboardRecentProjectComponent;
  let fixture: ComponentFixture<DashboardRecentProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardRecentProjectComponent]
    });
    fixture = TestBed.createComponent(DashboardRecentProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
