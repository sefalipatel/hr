import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { moveItemInArray, transferArrayItem, DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
enum StatusEnum {
  Available = 0,
  Assigned = 1,
  Inprogress = 2,
  Inreview = 3,
  Reopen = 4,
  Completed = 5
}

enum Priority {
  Low,
  Medium,
  High
}

@Component({
  selector: 'app-project-taskboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, DragDropModule, SharedModule, RouterModule, MatTooltipModule],
  templateUrl: './project-taskboard.component.html',
  styleUrls: ['./project-taskboard.component.scss']
})
export class ProjectTaskboardComponent {
  projectId: any;
  tashBoard: any;
  sprintList: any[] = [];
  currentSprint: any = null;
  taskId: any;
  priority = Priority;
  userDetail;
  taskCard = [
    { name: 'Available', id: StatusEnum.Available },
    { name: 'Assigned', id: StatusEnum.Assigned },
    { name: 'In-Progress', id: StatusEnum.Inprogress },
    { name: 'In-Review', id: StatusEnum.Inreview },
    { name: 'Re-Open', id: StatusEnum.Reopen },
    { name: 'Completed', id: StatusEnum.Completed }
  ];
  userProfile: any;
  public attachmentUrl: string = environment.apiUrl.replace('api/', '');
  constructor(
    private router: Router,
    private api: CommonService,
    private activeRoute: ActivatedRoute
  ) {
    this.projectId = this.activeRoute.snapshot.params['id'] ?? '';
  }

  ngOnInit() {
    this.getAllSprint();
    setTimeout(() => {
      this.onSprintChange(this.currentSprint); 
    }, 1000);
    this.getProjectMember();
  } 
drop(event: CdkDragDrop<any[]>) {
  const draggedTask = event.previousContainer.data[event.previousIndex];
  const targetStatus = +event.container.id;


  const isAssigned = !!draggedTask?.taskAssignmentName?.trim();

  if (isAssigned && targetStatus === StatusEnum.Available) {
    this.api.showToast('Assigned task cannot be moved to Available.', ToastType.ERROR, ToastType.ERROR);
    return;
  }

  if (!isAssigned && targetStatus !== StatusEnum.Available) {
    this.api.showToast('Cannot move task. Please assign the task to someone first.', ToastType.ERROR, ToastType.ERROR);
    return;
  }

  const taskId = draggedTask.id;

  this.api.put(`Task/status?taskId=${taskId}&status=${targetStatus}`, null).subscribe({
    next: () => {
      this.onSprintChange(this.currentSprint);
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
    },
    error: (err) => {
      this.api.showToast('Something went wrong while updating the task status.', ToastType.ERROR, ToastType.ERROR);
      console.error(err);
    }
  });
}


  getAllTaskboard() {
    this.api.get(`Task/project/${this.projectId}`).subscribe((res) => {
      this.tashBoard = res;
      this.taskCard = this.taskCard.map((x) => {
        x['list'] = this.tashBoard.filter((t) => t.status == x.id);
        return x;
      });
    });
  } 
  getAllSprint() {
    this.api.get(`Sprint/GetAllSprintByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      this.sprintList = res;

      // Find and assign current sprint
      const currentSprintVal = res.find((sprint) => sprint.status === 1);
      this.currentSprint = currentSprintVal?.id;

      // Call onSprintChange only after setting currentSprint
      this.onSprintChange(this.currentSprint);
    });
  } 
  onSprintChange(sprintId: any) {
    if (!sprintId) {
      this.tashBoard = [];
      this.taskCard.forEach((card) => (card['list'] = []));
      this.getAllTaskboard();
      return;
    }

    this.api.get(`Task/project/${this.projectId}?sprintId=${sprintId}`).subscribe((res) => {
      this.tashBoard = res;
      this.taskCard = this.taskCard.map((x) => {
        x['list'] = this.tashBoard.filter((t) => t.status == x.id);
        return x;
      });
    });
  }

  getProjectMember() {
    this.api.get(`ProjectMembers/GetListByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      this.userProfile = res;
      if (res?.length) {
        this.userDetail = res[0];
      }
    });
  }

  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
  }

  stringToColor(string: any) {
    let hash = 0;
    let i;
    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
    return string?.length ? color : '#bfbfbf';
  }

  // Replace 'wwwroot\\' with an empty string to remove it from the file path
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }

  navigate() {
    this.router.navigateByUrl('/project-dashboard');
  }
}
