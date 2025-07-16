import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgListPresentationComponent } from './org-list-presentation.component';

describe('OrgListPresentationComponent', () => {
  let component: OrgListPresentationComponent;
  let fixture: ComponentFixture<OrgListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OrgListPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
