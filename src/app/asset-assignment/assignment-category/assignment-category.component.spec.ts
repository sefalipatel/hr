import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentCategoryComponent } from './assignment-category.component';

describe('AssignmentCategoryComponent', () => {
  let component: AssignmentCategoryComponent;
  let fixture: ComponentFixture<AssignmentCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssignmentCategoryComponent]
    });
    fixture = TestBed.createComponent(AssignmentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
