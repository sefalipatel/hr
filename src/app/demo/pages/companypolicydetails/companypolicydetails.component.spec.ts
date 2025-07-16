import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypolicydetailsComponent } from './companypolicydetails.component';

describe('CompanypolicydetailsComponent', () => {
  let component: CompanypolicydetailsComponent;
  let fixture: ComponentFixture<CompanypolicydetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanypolicydetailsComponent]
    });
    fixture = TestBed.createComponent(CompanypolicydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
