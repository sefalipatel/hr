import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInsuranceFormComponent } from './employee-insurance-form.component';

describe('EmployeeInsuranceFormComponent', () => {
  let component: EmployeeInsuranceFormComponent;
  let fixture: ComponentFixture<EmployeeInsuranceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeInsuranceFormComponent]
    });
    fixture = TestBed.createComponent(EmployeeInsuranceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
