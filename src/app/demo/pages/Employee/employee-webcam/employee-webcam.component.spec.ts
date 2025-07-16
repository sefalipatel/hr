import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWebcamComponent } from './employee-webcam.component';

describe('EmployeeWebcamComponent', () => {
  let component: EmployeeWebcamComponent;
  let fixture: ComponentFixture<EmployeeWebcamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmployeeWebcamComponent]
    });
    fixture = TestBed.createComponent(EmployeeWebcamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
