import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminationFormComponent } from './termination-form.component';

describe('TerminationFormComponent', () => {
  let component: TerminationFormComponent;
  let fixture: ComponentFixture<TerminationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TerminationFormComponent]
    });
    fixture = TestBed.createComponent(TerminationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
