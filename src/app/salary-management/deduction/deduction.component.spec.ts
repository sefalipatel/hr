import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionComponent } from './deduction.component';

describe('DeductionComponent', () => {
  let component: DeductionComponent;
  let fixture: ComponentFixture<DeductionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeductionComponent]
    });
    fixture = TestBed.createComponent(DeductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
