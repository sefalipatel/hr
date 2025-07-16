import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPollComponent } from './dashboard-poll.component';

describe('DashboardPollComponent', () => {
  let component: DashboardPollComponent;
  let fixture: ComponentFixture<DashboardPollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardPollComponent]
    });
    fixture = TestBed.createComponent(DashboardPollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
