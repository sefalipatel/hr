import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollComponentFormComponent } from './payroll-component-form.component';

describe('PayrollComponentFormComponent', () => {
  let component: PayrollComponentFormComponent;
  let fixture: ComponentFixture<PayrollComponentFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayrollComponentFormComponent]
    });
    fixture = TestBed.createComponent(PayrollComponentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
