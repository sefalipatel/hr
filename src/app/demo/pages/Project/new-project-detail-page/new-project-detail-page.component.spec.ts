import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProjectDetailPageComponent } from './new-project-detail-page.component';

describe('NewProjectDetailPageComponent', () => {
  let component: NewProjectDetailPageComponent;
  let fixture: ComponentFixture<NewProjectDetailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewProjectDetailPageComponent]
    });
    fixture = TestBed.createComponent(NewProjectDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
