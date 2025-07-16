import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTicketDetailComponent } from './new-ticket-detail.component';

describe('NewTicketDetailComponent', () => {
  let component: NewTicketDetailComponent;
  let fixture: ComponentFixture<NewTicketDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTicketDetailComponent]
    });
    fixture = TestBed.createComponent(NewTicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
