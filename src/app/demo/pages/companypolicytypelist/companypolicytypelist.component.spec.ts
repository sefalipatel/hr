import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypolicytypelistComponent } from './companypolicytypelist.component';

describe('CompanypolicytypelistComponent', () => {
  let component: CompanypolicytypelistComponent;
  let fixture: ComponentFixture<CompanypolicytypelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompanypolicytypelistComponent]
    });
    fixture = TestBed.createComponent(CompanypolicytypelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
