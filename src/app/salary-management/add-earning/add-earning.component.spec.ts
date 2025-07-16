import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEarningComponent } from './add-earning.component';

describe('AddEarningComponent', () => {
  let component: AddEarningComponent;
  let fixture: ComponentFixture<AddEarningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEarningComponent]
    });
    fixture = TestBed.createComponent(AddEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
