import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgPresentationComponent } from './org-presentation.component';

describe('OrgPresentationComponent', () => {
  let component: OrgPresentationComponent;
  let fixture: ComponentFixture<OrgPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OrgPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
