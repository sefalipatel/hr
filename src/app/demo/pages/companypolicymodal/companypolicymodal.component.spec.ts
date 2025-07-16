import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypolicymodalComponent } from './companypolicymodal.component';

describe('CompanypolicymodalComponent', () => {
  let component: CompanypolicymodalComponent;
  let fixture: ComponentFixture<CompanypolicymodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanypolicymodalComponent]
    });
    fixture = TestBed.createComponent(CompanypolicymodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
