import { ComponentFixture, TestBed } from '@angular/core/testing';

import BankDetailsComponent  from './bank-details.component';

describe('BankDetailsComponent', () => {
  let component: BankDetailsComponent;
  let fixture: ComponentFixture<BankDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankDetailsComponent]
    });
    fixture = TestBed.createComponent(BankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
