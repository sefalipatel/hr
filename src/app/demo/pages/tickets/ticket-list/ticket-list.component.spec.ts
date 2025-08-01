import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketListComponent } from './ticket-list.component';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketListComponent]
    });
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
