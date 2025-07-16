import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSprintTaskComponent } from './project-sprint-task.component';

describe('ProjectSprintTaskComponent', () => {
  let component: ProjectSprintTaskComponent;
  let fixture: ComponentFixture<ProjectSprintTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectSprintTaskComponent]
    });
    fixture = TestBed.createComponent(ProjectSprintTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
