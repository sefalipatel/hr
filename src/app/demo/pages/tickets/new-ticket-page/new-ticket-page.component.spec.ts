import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTicketPageComponent } from './new-ticket-page.component';

describe('NewTicketPageComponent', () => {
  let component: NewTicketPageComponent;
  let fixture: ComponentFixture<NewTicketPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTicketPageComponent]
    });
    fixture = TestBed.createComponent(NewTicketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
