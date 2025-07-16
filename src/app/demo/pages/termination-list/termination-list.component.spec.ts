import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminationListComponent } from './termination-list.component';

describe('TerminationListComponent', () => {
  let component: TerminationListComponent;
  let fixture: ComponentFixture<TerminationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TerminationListComponent]
    });
    fixture = TestBed.createComponent(TerminationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
