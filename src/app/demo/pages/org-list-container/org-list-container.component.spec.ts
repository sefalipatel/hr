import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgListContainerComponent } from './org-list-container.component';

describe('OrgListContainerComponent', () => {
  let component: OrgListContainerComponent;
  let fixture: ComponentFixture<OrgListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OrgListContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
