import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDashboard2Component } from './new-dashboard2.component';

describe('NewDashboard2Component', () => {
  let component: NewDashboard2Component;
  let fixture: ComponentFixture<NewDashboard2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewDashboard2Component]
    });
    fixture = TestBed.createComponent(NewDashboard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
