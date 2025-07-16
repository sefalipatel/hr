import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSalaryFormComponent } from './advance-salary-form.component';

describe('AdvanceSalaryFormComponent', () => {
  let component: AdvanceSalaryFormComponent;
  let fixture: ComponentFixture<AdvanceSalaryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdvanceSalaryFormComponent]
    });
    fixture = TestBed.createComponent(AdvanceSalaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
