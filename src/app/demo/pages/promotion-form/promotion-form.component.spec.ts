import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionFormComponent } from './promotion-form.component';

describe('PromotionFormComponent', () => {
  let component: PromotionFormComponent;
  let fixture: ComponentFixture<PromotionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PromotionFormComponent]
    });
    fixture = TestBed.createComponent(PromotionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
