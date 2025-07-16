import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeInsuranceListComponent } from './employee-insurance-list.component';

describe('EmployeeInsuranceListComponent', () => {
  let component: EmployeeInsuranceListComponent;
  let fixture: ComponentFixture<EmployeeInsuranceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeInsuranceListComponent]
    });
    fixture = TestBed.createComponent(EmployeeInsuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
