import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingFormComponent } from './organization-setting-form.component';

describe('OrganizationSettingFormComponent', () => {
  let component: OrganizationSettingFormComponent;
  let fixture: ComponentFixture<OrganizationSettingFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrganizationSettingFormComponent]
    });
    fixture = TestBed.createComponent(OrganizationSettingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
