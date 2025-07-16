import { ComponentFixture, TestBed } from '@angular/core/testing';

import  MissingTimeAddComponent  from './missing-time-add.component';

describe('MissingTimeAddComponent', () => {
  let component: MissingTimeAddComponent;
  let fixture: ComponentFixture<MissingTimeAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MissingTimeAddComponent]
    });
    fixture = TestBed.createComponent(MissingTimeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
