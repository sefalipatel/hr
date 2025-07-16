import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryEarningComponent } from './salary-earning.component';

describe('SalaryEarningComponent', () => {
  let component: SalaryEarningComponent;
  let fixture: ComponentFixture<SalaryEarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalaryEarningComponent]
    });
    fixture = TestBed.createComponent(SalaryEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
