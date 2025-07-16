import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonalInsuranceFormComponent } from './employee-personal-insurance-form.component';

describe('EmployeePersonalInsuranceFormComponent', () => {
  let component: EmployeePersonalInsuranceFormComponent;
  let fixture: ComponentFixture<EmployeePersonalInsuranceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeePersonalInsuranceFormComponent]
    });
    fixture = TestBed.createComponent(EmployeePersonalInsuranceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
