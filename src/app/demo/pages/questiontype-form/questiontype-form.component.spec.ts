import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestiontypeFormComponent } from './questiontype-form.component';

describe('QuestiontypeFormComponent', () => {
  let component: QuestiontypeFormComponent;
  let fixture: ComponentFixture<QuestiontypeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestiontypeFormComponent]
    });
    fixture = TestBed.createComponent(QuestiontypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
