import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonalInsuranceListComponent } from './employee-personal-insurance-list.component';

describe('EmployeePersonalInsuranceListComponent', () => {
  let component: EmployeePersonalInsuranceListComponent;
  let fixture: ComponentFixture<EmployeePersonalInsuranceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeePersonalInsuranceListComponent]
    });
    fixture = TestBed.createComponent(EmployeePersonalInsuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
