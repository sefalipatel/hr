import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryDetailFormComponent } from './employee-salary-detail-form.component';

describe('EmployeeSalaryDetailFormComponent', () => {
  let component: EmployeeSalaryDetailFormComponent;
  let fixture: ComponentFixture<EmployeeSalaryDetailFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeSalaryDetailFormComponent]
    });
    fixture = TestBed.createComponent(EmployeeSalaryDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
