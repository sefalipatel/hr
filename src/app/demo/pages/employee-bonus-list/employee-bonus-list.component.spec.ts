import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeBonusListComponent } from './employee-bonus-list.component';

describe('EmployeeBonusListComponent', () => {
  let component: EmployeeBonusListComponent;
  let fixture: ComponentFixture<EmployeeBonusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeBonusListComponent]
    });
    fixture = TestBed.createComponent(EmployeeBonusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
