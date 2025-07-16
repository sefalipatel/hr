import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectaddComponent } from './projectadd.component';

describe('ProjectaddComponent', () => {
  let component: ProjectaddComponent;
  let fixture: ComponentFixture<ProjectaddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectaddComponent]
    });
    fixture = TestBed.createComponent(ProjectaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
