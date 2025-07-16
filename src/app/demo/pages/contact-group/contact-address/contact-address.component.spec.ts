import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAddressComponent } from './contact-address.component';

describe('ContactAddressComponent', () => {
  let component: ContactAddressComponent;
  let fixture: ComponentFixture<ContactAddressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactAddressComponent]
    });
    fixture = TestBed.createComponent(ContactAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
