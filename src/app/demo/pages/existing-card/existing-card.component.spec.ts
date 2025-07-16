import { ComponentFixture, TestBed } from '@angular/core/testing';

import ExistingCardComponent  from './existing-card.component';
// import HolidaycardComponent from '../Holiday-card/holiday-card.component';

describe('ExistingCardComponent', () => {
  let component: ExistingCardComponent;
  let fixture: ComponentFixture<ExistingCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExistingCardComponent]
    });
    fixture = TestBed.createComponent(ExistingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
