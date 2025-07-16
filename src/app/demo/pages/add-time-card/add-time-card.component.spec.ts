import { ComponentFixture, TestBed } from '@angular/core/testing';

import addtimecardcomponent from './add-time-card.component';

describe('addtimecardcomponent', () => {
  let component: addtimecardcomponent;
  let fixture: ComponentFixture<addtimecardcomponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [addtimecardcomponent]
    });
    fixture = TestBed.createComponent(addtimecardcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
