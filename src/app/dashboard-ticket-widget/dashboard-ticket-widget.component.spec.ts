import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTicketWidgetComponent } from './dashboard-ticket-widget.component';

describe('DashboardTicketWidgetComponent', () => {
  let component: DashboardTicketWidgetComponent;
  let fixture: ComponentFixture<DashboardTicketWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardTicketWidgetComponent]
    });
    fixture = TestBed.createComponent(DashboardTicketWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
