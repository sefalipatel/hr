import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWfhCompoffComponent } from './add-wfh-compoff.component';

describe('AddWfhCompoffComponent', () => {
  let component: AddWfhCompoffComponent;
  let fixture: ComponentFixture<AddWfhCompoffComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddWfhCompoffComponent]
    });
    fixture = TestBed.createComponent(AddWfhCompoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
