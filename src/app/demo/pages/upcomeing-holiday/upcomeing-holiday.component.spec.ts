import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomeingHolidayComponent } from './upcomeing-holiday.component';

describe('UpcomeingHolidayComponent', () => {
  let component: UpcomeingHolidayComponent;
  let fixture: ComponentFixture<UpcomeingHolidayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UpcomeingHolidayComponent]
    });
    fixture = TestBed.createComponent(UpcomeingHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
