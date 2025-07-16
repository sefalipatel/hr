import { ComponentFixture, TestBed } from '@angular/core/testing';

import  AddAssignmentCategoryComponent from './add-assignment-category.component';

describe('AddAssignmentCategoryComponent', () => {
  let component: AddAssignmentCategoryComponent;
  let fixture: ComponentFixture<AddAssignmentCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddAssignmentCategoryComponent]
    });
    fixture = TestBed.createComponent(AddAssignmentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
