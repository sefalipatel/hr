import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSocialProfileComponent } from './contact-social-profile.component';

describe('ContactSocialProfileComponent', () => {
  let component: ContactSocialProfileComponent;
  let fixture: ComponentFixture<ContactSocialProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactSocialProfileComponent]
    });
    fixture = TestBed.createComponent(ContactSocialProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
