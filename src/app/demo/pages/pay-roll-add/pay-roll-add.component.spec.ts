import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayRollAddComponent } from './pay-roll-add.component';

describe('PayRollAddComponent', () => {
  let component: PayRollAddComponent;
  let fixture: ComponentFixture<PayRollAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PayRollAddComponent]
    });
    fixture = TestBed.createComponent(PayRollAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
