import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTabComponent } from './salary-tab.component';

describe('SalaryTabComponent', () => {
  let component: SalaryTabComponent;
  let fixture: ComponentFixture<SalaryTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SalaryTabComponent]
    });
    fixture = TestBed.createComponent(SalaryTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
