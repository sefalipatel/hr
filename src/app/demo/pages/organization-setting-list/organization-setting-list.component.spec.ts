import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingListComponent } from './organization-setting-list.component';

describe('OrganizationSettingListComponent', () => {
  let component: OrganizationSettingListComponent;
  let fixture: ComponentFixture<OrganizationSettingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrganizationSettingListComponent]
    });
    fixture = TestBed.createComponent(OrganizationSettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
