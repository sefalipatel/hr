import { ComponentFixture, TestBed } from '@angular/core/testing';

import AddNewCardComponent from './add-new-card.component';

describe('AddNewCardComponent', () => {
  let component: AddNewCardComponent;
  let fixture: ComponentFixture<AddNewCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCardComponent]
    });
    fixture = TestBed.createComponent(AddNewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
