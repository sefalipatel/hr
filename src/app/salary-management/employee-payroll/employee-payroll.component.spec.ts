import { ComponentFixture, TestBed } from '@angular/core/testing';

import  EmployeePayrollComponent  from './employee-payroll.component';

describe('EmployeePayrollComponent', () => {
  let component: EmployeePayrollComponent;
  let fixture: ComponentFixture<EmployeePayrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeePayrollComponent]
    });
    fixture = TestBed.createComponent(EmployeePayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
