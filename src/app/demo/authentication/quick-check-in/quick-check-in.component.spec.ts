import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCheckInComponent } from './quick-check-in.component';

describe('QuickCheckInComponent', () => {
  let component: QuickCheckInComponent;
  let fixture: ComponentFixture<QuickCheckInComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuickCheckInComponent]
    });
    fixture = TestBed.createComponent(QuickCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
