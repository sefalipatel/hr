import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCheckinOutComponent } from './person-checkin-out.component';

describe('PersonCheckinOutComponent', () => {
  let component: PersonCheckinOutComponent;
  let fixture: ComponentFixture<PersonCheckinOutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonCheckinOutComponent]
    });
    fixture = TestBed.createComponent(PersonCheckinOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
