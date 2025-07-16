import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionComponent } from './subscription.component';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubscriptionComponent]
    });
    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
