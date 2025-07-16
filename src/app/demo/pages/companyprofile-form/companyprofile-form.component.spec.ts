import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyprofileFormComponent } from './companyprofile-form.component';

describe('CompanyprofileFormComponent', () => {
  let component: CompanyprofileFormComponent;
  let fixture: ComponentFixture<CompanyprofileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanyprofileFormComponent]
    });
    fixture = TestBed.createComponent(CompanyprofileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
