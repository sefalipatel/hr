import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCompanyHRPolicyComponent } from './dashboard-company-hr-policy.component';

describe('DashboardCompanyHRPolicyComponent', () => {
  let component: DashboardCompanyHRPolicyComponent;
  let fixture: ComponentFixture<DashboardCompanyHRPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardCompanyHRPolicyComponent]
    });
    fixture = TestBed.createComponent(DashboardCompanyHRPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
