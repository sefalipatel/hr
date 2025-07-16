import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUserWarningComponent } from './dashboard-user-warning.component';

describe('DashboardUserWarningComponent', () => {
  let component: DashboardUserWarningComponent;
  let fixture: ComponentFixture<DashboardUserWarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardUserWarningComponent]
    });
    fixture = TestBed.createComponent(DashboardUserWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
