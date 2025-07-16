import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfDetailsComponent } from './pf-details.component';

describe('PfDetailsComponent', () => {
  let component: PfDetailsComponent;
  let fixture: ComponentFixture<PfDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PfDetailsComponent]
    });
    fixture = TestBed.createComponent(PfDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
