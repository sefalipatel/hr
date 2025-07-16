import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSalaryListComponent } from './advance-salary-list.component';

describe('AdvanceSalaryListComponent', () => {
  let component: AdvanceSalaryListComponent;
  let fixture: ComponentFixture<AdvanceSalaryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdvanceSalaryListComponent]
    });
    fixture = TestBed.createComponent(AdvanceSalaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
