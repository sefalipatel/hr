import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyttusCareerComponent } from './skyttus-career.component';

describe('SkyttusCareerComponent', () => {
  let component: SkyttusCareerComponent;
  let fixture: ComponentFixture<SkyttusCareerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyttusCareerComponent]
    });
    fixture = TestBed.createComponent(SkyttusCareerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
