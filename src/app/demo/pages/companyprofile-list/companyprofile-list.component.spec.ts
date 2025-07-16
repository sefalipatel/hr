import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyprofileListComponent } from './companyprofile-list.component';

describe('CompanyprofileListComponent', () => {
  let component: CompanyprofileListComponent;
  let fixture: ComponentFixture<CompanyprofileListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanyprofileListComponent]
    });
    fixture = TestBed.createComponent(CompanyprofileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
