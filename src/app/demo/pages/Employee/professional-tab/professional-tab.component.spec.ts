import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalTabComponent } from './professional-tab.component';

describe('ProfessionalTabComponent', () => {
  let component: ProfessionalTabComponent;
  let fixture: ComponentFixture<ProfessionalTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfessionalTabComponent]
    });
    fixture = TestBed.createComponent(ProfessionalTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
