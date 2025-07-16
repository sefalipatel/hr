import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdminDashboard2Component } from './new-admin-dashboard2.component';

describe('NewAdminDashboard2Component', () => {
  let component: NewAdminDashboard2Component;
  let fixture: ComponentFixture<NewAdminDashboard2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewAdminDashboard2Component]
    });
    fixture = TestBed.createComponent(NewAdminDashboard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
