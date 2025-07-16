import { ComponentFixture, TestBed } from '@angular/core/testing';

import AtteandaceComponent from './atteandace.component';

describe('AtteandaceComponent', () => {
  let component: AtteandaceComponent;
  let fixture: ComponentFixture<AtteandaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtteandaceComponent]
    });
    fixture = TestBed.createComponent(AtteandaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
