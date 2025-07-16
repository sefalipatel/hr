import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAuthenticationComponent } from './organization-authentication.component';

describe('OrganizationAuthenticationComponent', () => {
  let component: OrganizationAuthenticationComponent;
  let fixture: ComponentFixture<OrganizationAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrganizationAuthenticationComponent]
    });
    fixture = TestBed.createComponent(OrganizationAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
