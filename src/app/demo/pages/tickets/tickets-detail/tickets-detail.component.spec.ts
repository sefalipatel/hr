import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsDetailComponent } from './tickets-detail.component';

describe('TicketsDetailComponent', () => {
  let component: TicketsDetailComponent;
  let fixture: ComponentFixture<TicketsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketsDetailComponent]
    });
    fixture = TestBed.createComponent(TicketsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
