import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailPageComponent } from './task-detail-page.component';

describe('TaskDetailPageComponent', () => {
  let component: TaskDetailPageComponent;
  let fixture: ComponentFixture<TaskDetailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskDetailPageComponent]
    });
    fixture = TestBed.createComponent(TaskDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
