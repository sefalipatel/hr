import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskboardComponent } from './project-taskboard.component';

describe('ProjectTaskboardComponent', () => {
  let component: ProjectTaskboardComponent;
  let fixture: ComponentFixture<ProjectTaskboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectTaskboardComponent]
    });
    fixture = TestBed.createComponent(ProjectTaskboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
