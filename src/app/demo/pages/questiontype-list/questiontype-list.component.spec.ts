import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestiontypeListComponent } from './questiontype-list.component';

describe('QuestiontypeListComponent', () => {
  let component: QuestiontypeListComponent;
  let fixture: ComponentFixture<QuestiontypeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuestiontypeListComponent]
    });
    fixture = TestBed.createComponent(QuestiontypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
