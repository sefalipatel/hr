import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorComponent, AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

export enum Status {
  Available = 0,
  Assigned = 1,
  InProgress = 2,
  InReview = 3,
  ReOpen = 4,
  Completed = 5
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

export enum TaskType {
  Story = 1,
  Task = 2,
  Issue = 3
}

export enum SprintStatus {
  NotStarted = 0,
  Current = 1,
  OnHold = 2,
  Completed = 3
}
@Component({
  selector: 'app-project-sprint-task',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    DatePipe,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    AngularEditorModule
  ],
  templateUrl: './project-sprint-task.component.html',
  styleUrls: ['./project-sprint-task.component.scss']
})
export class ProjectSprintTaskComponent implements OnInit {
  projectAllData: any;
  form: FormGroup;
  task: FormControl = new FormControl('', [Validators.required]);
  description: FormControl = new FormControl('', [Validators.required]);
  assignDueDate: FormControl = new FormControl('', [Validators.required]);
  public getProjecttaskData: any[];
  selectedTaskIndex: number = -1;
  projectWiseTask: any = [];
  loading: boolean = false;
  public sprintType = SprintStatus;
  public completedStatus: any[] = [
    {
      value: 'Re-Open',
      status: 5
    }
  ];
  public priorityList = [
    {
      name: 'High',
      value: Priority.High
    },
    {
      name: 'Medium',
      value: Priority.Medium
    },
    {
      name: 'Low',
      value: Priority.Low
    }
  ];
  public sprintStatus: any[] = [
    {
      value: 'Start',
      status: 0
    },
    {
      value: 'OnHold',
      status: 2
    },
    {
      value: 'Completed',
      status: 3
    }
  ];
  projectId: any;
  getAllTaskData: any = null;
  isAddTask: boolean = false;
  isDecFocus: boolean = false;
  isSubmitted: boolean = false;
  attachmentURL: string = environment.apiUrl.replace('api/', '');
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');

  @ViewChild('addInput') addInput: ElementRef;
  @ViewChild('editInput') editInput: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedFiles: File[] = [];
  getTaskById: any;
  id: any;
  isTaskDetailsDisable = false;
  AssignUserByProjects: any;
  taskConversion: any;
  attechments: any;
  TaskiD: any;
  dueDateFormate: any;
  personId: any;
  changeStatus: any;
  uploadedlogo: any[] = [];
  projectName: any;
  timeLineData: any;
  comment: any = '';
  isTimeLine = false;
  public allSprint: any;
  public sprintId: any;
  public sprintWiseTask: any;
  public isDisplay: boolean = false;
  public editSprintIndex: number | null = null;
  sprintNameControl = new FormControl('', Validators.required);
  @ViewChild('sprintInput') sprintInput!: ElementRef;
  @ViewChild('search') search: ElementRef;
  Status: any;
  public selectedTaskType: number = 2;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    sanitize: false,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['insertImage', 'insertVideo']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote'
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1'
      }
    ]
  };
  public taskTypeList: any[] = [
    { name: 'Story', value: TaskType.Story, image: 'fa fa-bookmark-o' },
    { name: 'Task', value: TaskType.Task, image: 'fa fa-check-square' },
    { name: 'Issue', value: TaskType.Issue, image: 'fa fa-square-o' }
  ];
  constructor(
    private api: CommonService,
    private elRef: ElementRef,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private router: Router,
    private elementRef: ElementRef,
    private sweetlalert: SweetalertService
  ) {
    this.form = this.fb.group({
      Comment: ''
    });
  }
  @ViewChild('editorContainer') editorContainer!: ElementRef;
  isEditorTouched: boolean = false;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event, item: any) {
    if (this.editorContainer && !this.editorContainer.nativeElement.contains(event.target)) {
      if (this.isEditorTouched) {
        this.handleEditorBlur(item);
        this.isEditorTouched = false;
      }
    }
  }

  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.projectId = this.activeRoute.snapshot.params['id'] ?? '';
    let task: any = this.activeRoute.snapshot.queryParams ?? null; 
    this.getAllSprint(); 
    this.AssignUserByProject();
  }

  getSelectedTaskType(type?: any) {
    return this.taskTypeList.find((item) => item.value === type);
  }
  getFilteredSprintStatus(currentStatus: number) {
    if (currentStatus === 1) {
      return this.sprintStatus.filter((s) => s.status === 2 || s.status === 3);
    }
    if (currentStatus === 2) {
      return this.sprintStatus.filter((s) => s.status === 0 || s.status === 3);
    }
    return [];
  }

  getSprintStatusLabel(status: number): string {
    const sprint = this.sprintStatus.find((s) => s.status === status);
    return sprint ? sprint.value : 'Unknown';
  }

  /**
   * edit sprint name
   */
  onSprintEdit(sprint: any, index: number) {
    this.editSprintIndex = index;
    this.sprintNameControl.setValue(sprint.sprintName);

    setTimeout(() => {
      this.sprintInput?.nativeElement.focus();
    }, 100);
  }

  updateSprintName(sprint: any, index: number) {
    if (this.sprintNameControl.invalid) return;

    sprint.sprintName = this.sprintNameControl.value;
    this.editSprintIndex = null;

    //  API call
    let payload = {
      id: sprint.id,
      sprintName: sprint.sprintName,
      projectId: this.projectId
    };
    this.api.put(`Sprint`, payload).subscribe((res) => {});
  }

  closeSprintEdit() {
    this.editSprintIndex = null;
  }

  onSprintStatusUpdate(id, status: any) {
    if (status === 0) status = 1;
    this.api.put(`Sprint/StartSprint?sprintId=${id}&Status=${status}`, '').subscribe(
      (res) => {
        if (res.statusCode === 200) {
          this.api.showToast('Sprint started successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        } else if (res.statusCode === 400) {
          this.api.showToast(res?.errors[0]?.errorMessage, ToastType.WARNING, ToastType.WARNING);
        }
        this.getAllSprint();
      },
      (err) => {
        this.api.showToast(`Complete all tasks in the current sprint before starting a new one.`, ToastType.WARNING, ToastType.WARNING);
      }
    );
  }

  onEditorFocus() {
    this.isEditorTouched = true;
  }

  onEditorChange() {
    this.isEditorTouched = true;
  } 
  trimNameOnBlur() {
    if (this.task.value) {
      const trimmedValue = this.task.value.trim();
      this.task.setValue(trimmedValue || '', { emitEvent: false });
    }
  }

  onCommentChange(item: any) {
    this.saveTask(this.sprintId, item);
  } 
  getByIdtaskWiseDetails(projectTasklist) {
    this.getAllTaskData = null;
    this.api.get(`Task/${projectTasklist.id}`).subscribe((x) => {
      this.getAllTaskData = x?.length ? x[0] : null;
      this.task.setValue(this.getAllTaskData.subject);
      this.comment = this.getAllTaskData?.description;
      this.getTaskById = projectTasklist.id;
      this.getAllconversation();
      this.getAllFollewers();
      this.getTimeline();
    });
    this.isTaskDetailsDisable = true;
  }
  addTask(index) {
    this.task.reset();

    this.isAddTask = true;
    this.isDisplay = false;
    this.selectedTaskIndex = index;
    this.sprintId = this.allSprint[index].id; 
    this.getTaskById = '';
    this.comment = '';
    setTimeout(() => {
      this.addInput.nativeElement.focus();
    }, 100);
  }

  saveTask(sprintId: string, item: any, status?: any) {
    this.sprintId = sprintId;
    // Trim the task value before validation
    if (this.task.value) {
      const trimmedValue = this.task.value.trim();
      this.task.setValue(trimmedValue || '', { emitEvent: false });

      // If the field becomes empty after trimming, mark as invalid
      if (!trimmedValue) {
        this.isSubmitted = true;
        return;
      }
    }

    if (this.comment) {
      const trimmedComment = this.comment.trim();

      if (!trimmedComment) {
        this.comment = '';
        return;
      } else {
        this.comment = trimmedComment;
      }
    }

    if (this.task.invalid && !this.isDecFocus) {
      this.isSubmitted = true;
      return;
    }

    if (this.getTaskById || this.comment) {
      let selectedStatus = status === 5 ? 5 : status;
      const payload = {
        id: this.getTaskById,
        sprintId: this.sprintId,
        ProjectId: this.projectId,
        Subject: this.task?.value,
        Description: this.comment || '',
        status: selectedStatus
      }; 
      this.api.put(`Task`, payload).subscribe(
        (x) => {
          this.isDecFocus = false;
          this.api.showToast('Task Updated Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          const projectTasklist = {
            id: this.getTaskById
          }; 
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
          this.selectedTaskIndex = -1; 
        },
        (error) => {
          if (payload?.Description === '') {
            this.api.showToast('Please enter description.', ToastType.ERROR, ToastType.ERROR);
          } else {
            this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
          }
        }
      );
    } else {
      let payload: any = {
        ProjectId: this.projectId,
        sprintId: this.sprintId,
        Subject: this.task?.value,
        Description: this.comment || '',
        TaskType: item.selectedTaskType
      };
      payload = this.comment ? { ...payload, Description: this.comment } : payload;

      this.api.post(`Task`, payload).subscribe(
        (x) => {
          this.api.showToast('Task added successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
          this.selectedTaskIndex = -1;
        },
        (error) => {
          if (payload?.Description === '') {
            this.api.showToast('Please enter description.', ToastType.ERROR, ToastType.ERROR);
          } else {
            this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
          }
        }
      );
    }
    this.selectedTaskIndex = -1;
    this.isAddTask = false;
    this.isSubmitted = false; 
  }

  trimNameOnBlurDes(controlName: string) {
    const control = this[controlName];
    if (control) {
      const trimmedValue = control.trim();
      if (trimmedValue === '') {
        this[controlName] = '';
      } else {
        this[controlName] = trimmedValue;
      }
    }
  }

  handleEditorBlur(item: any) {
    if (this.comment.trim()) {
      this.saveTask(this.sprintId, item);
    }
  }

  onTaskEdit(data, sprintId: any) {
    this.isTaskDetailsDisable = false;
    this.isDisplay = true; 
    this.getTaskById = data?.id;
    this.selectedTaskIndex = data;
    this.isTaskDetailsDisable = false;
    this.closeAddTaskForm();
    this.task.setValue(data?.subject);
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    }, 100);
    this.sprintId = sprintId;
    this.isAddTask = false;
  }

  closeAddTaskForm() {
    this.task.reset();
    this.selectedTaskIndex = -1;
    this.isAddTask = false;
    this.isSubmitted = false; 
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  deleteFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.fileInput.nativeElement.value = null;
  }
  sendData() {
    if (!this.selectedFiles.length && !this.form.get('Comment').value) {
      return;
    }
    const formData = new FormData();
    formData.append('Comment', this.form.get('Comment').value);
    formData.append('TaskId', this.getTaskById);
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('File', this.selectedFiles[i]);
    }

    this.api.post(`Task/conversion`, formData).subscribe(
      (x) => {
        if (x.statusCode == 200) {
          this.getAllconversation();
          this.form.reset();
          this.selectedFiles = [];
        }
      },
      (error) => {
        this.api.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }
  resetFormData() {
    this.form.reset();
    this.selectedFiles = [];
  }
  getAllconversation() { 
    this.api.get(`Task/conversion/${this.getTaskById}`).subscribe((x) => {
      if (x.statusCode == 200) {
        this.taskConversion = x.value;
      }
    });
  }

  AssignUserByProject() {
    this.api.get(`ProjectManagement/project/${this.projectId}`).subscribe((x) => {
      this.AssignUserByProjects = x.value.projectMembers;
      this.projectName = x.value.projectName;
    });
  } 
  onAssignSelected(Asssignid?: any) {
    if (!Asssignid) {
      this.api.delete(`Task/RemoveUser?taskId=${this.getTaskById}`, {}).subscribe(
        (x) => {
          const projectTasklist = {
            id: this.getTaskById
          };
          this.getByIdtaskWiseDetails(projectTasklist);
          this.api.showToast(x?.value, ToastType.SUCCESS, ToastType.SUCCESS);
        },
        (error) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        }
      );
    } else {
      this.api.put(`Task/assign?taskId=${this.getTaskById}&assignedId=${Asssignid?.personId} `, {}).subscribe(
        (x) => {
          const projectTasklist = {
            id: this.getTaskById
          };
          this.getByIdtaskWiseDetails(projectTasklist);
          this.api.showToast(x?.value, ToastType.SUCCESS, ToastType.SUCCESS);
        },
        (error) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }
  async deleteTask(projectTasklist, sprintId) {
    this.sprintId = sprintId;
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Task/${projectTasklist.id} `).subscribe(
        (res) => {
          this.isTaskDetailsDisable = false;
          if (res?.value === 'Task is already assigned to someone.') {
            this.api.showToast(res?.value, ToastType.WARNING, ToastType.WARNING);
          } else {
            this.api.showToast(`Task deleted successfully.`, ToastType.SUCCESS, ToastType.SUCCESS);
          }
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
        },
        (error) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  updateDueDate(data) {
    this.dueDateFormate = this.datepipe.transform(data._d, 'YYYY/MM/dd');
    this.api.put(`Task/dueDate?taskId=${this.getTaskById}&dueDate=${this.dueDateFormate} `, {}).subscribe(
      (x) => {
        this.api.showToast('Task due date updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        const projectTasklist = {
          id: this.getTaskById
        };
        this.getByIdtaskWiseDetails(projectTasklist);
      },
      (error) => {
        this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }
  closedsidemanu() {
    this.isTaskDetailsDisable = false;
  }

  navigate() {
    this.router.navigateByUrl('/project-dashboard');
  }
  getAllFollewers() {
    this.api.get(`Task/followers/${this.getTaskById} `).subscribe((x) => {
      this.uploadedlogo = [];
      x.value.map((img) => {
        let logo = img;
        let uploadedlogo = logo;
        this.uploadedlogo.push(uploadedlogo);
      });
    });
  }
  follower(folowerData?: any) {
    const payload = {
      TaskId: this.getTaskById,
      EmployeeId: folowerData?.personId
    };
    this.api.post(`Task/followers`, payload).subscribe((x) => {
      if (x.statusCode == 200) {
        this.api.showToast('Follower added successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        this.getAllFollewers();
      } else {
        this.api.showToast(x?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR);
      }
    });
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

  changeTaskStatus(alldata) {
    if (alldata?.status === 1) {
      if (alldata?.assignedId == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${2}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          };
          this.getByIdtaskWiseDetails(projectTasklist);
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
        });
      }
    } else if (alldata?.status === 2) {
      if (alldata?.createdBy == alldata?.assignedId && alldata?.createdBy == this.personId && alldata.assignedId == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${5}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          };
          this.getByIdtaskWiseDetails(projectTasklist);
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
        });
      } else if (alldata?.status === 2) {
        if (alldata?.assignedId == this.personId) {
          this.api.put(`Task/status?taskId=${this.getTaskById}&status=${3}`, {}).subscribe((x) => {
            const projectTasklist = {
              id: this.getTaskById
            };
            this.getByIdtaskWiseDetails(projectTasklist);
            let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
            this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
          });
        }
      }
    } else if (alldata?.status === 3) {
      if (alldata?.createdBy == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${5}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          };
          this.getByIdtaskWiseDetails(projectTasklist);
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
        });
      }
    } else if (alldata?.status === 5) {
      this.api.put(`Task/status?taskId=${this.getTaskById}&status=${2}&previousStatus=${5}`, {}).subscribe((x) => {
        const projectTasklist = {
          id: this.getTaskById
        };
        this.getByIdtaskWiseDetails(projectTasklist);
        let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
        this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
      });
    }
  }

  changeRejectedStatus(alldata) {
    if (alldata?.status === 3) {
      if (alldata?.createdBy == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${2}&previousStatus=${3}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          };
          this.getByIdtaskWiseDetails(projectTasklist);
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
        });
      }
    }
  }
  getTimeline() {
    this.api.get(`Task/timeline/${this.getTaskById}`).subscribe((x) => {
      this.timeLineData = x;
    });
  }
  onTimeLineChange() {
    this.isTimeLine = !this.isTimeLine;
  }
  updatePriority(taskId?: string, priority?: number) {
    this.api.put(`Task/priority?taskId=${taskId}&priority=${priority}`, {}).subscribe((res) => {
      const projectTasklist = {
        id: this.getTaskById
      };
      this.getByIdtaskWiseDetails(projectTasklist);
    });
  }
  getPriority(priority: Priority): string {
    switch (priority) {
      case Priority.High:
        return 'High';
      case Priority.Medium:
        return 'Medium';
      case Priority.Low:
        return 'Low';
      default:
        return '';
    }
  }
  getTaskType(type: TaskType): string {
    switch (type) {
      case TaskType.Story:
        return 'Story';
      case TaskType.Task:
        return 'Task';
      case TaskType.Issue:
        return 'Issue';
      default:
        return '';
    }
  }

  getSprintStatus(status: SprintStatus): string {
    switch (status) {
      case SprintStatus.NotStarted:
        return 'Start';
      case SprintStatus.Current:
        return 'Current';
      case SprintStatus.OnHold:
        return 'OnHold';
      case SprintStatus.Completed:
        return 'Completed';
      default:
        return '';
    }
  }

  getStatus(status?: any): string {
    if (status) {
      switch (status.status) {
        case Status.Available:
          return 'Available';
        case Status.Assigned:
          if (status.assignedId == this.personId) {
            return 'Pickup';
          } else {
            return 'Assigned';
          }
        case Status.InProgress:
          if (status?.createdBy == status?.assignedId && status?.createdBy == this.personId && status.assignedId == this.personId) {
            return 'Closed';
          } else if (status.assignedId == this.personId) {
            return 'Closed';
          } else {
            return 'In-Progress';
          }
        case Status.InReview:
          if (status.assignedId == this.personId) {
            return 'In-Review';
          } else if (status.createdBy == this.personId) {
            return 'Accept';
          } else {
            return 'In-Review';
          } 
        default:
          return 'Available';
      }
    } else {
      return '';
    }
  }
  // Filter completed and incompleted task
  filterData(event) {
    const selectedStatus = (event.target as HTMLSelectElement).value;
    if (selectedStatus === '0' || selectedStatus === '5') {
      this.projectWiseTask = this.getProjecttaskData.filter((item) => item.status == selectedStatus);
    } else {
      this.projectWiseTask = this.getProjecttaskData;
    }
  }

  getAllSprint() {
    this.loading = true;
    this.api.get(`Sprint/GetAllSprintByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      this.loading = false;
      this.allSprint = res;
      this.allSprint = this.allSprint.map((res) => ({
        ...res,
        selectedTaskType: 2
      }));
    });
  }

  toggleAccordion(index: number, id, isActive) {
    this.sprintId = id;
    this.allSprint[index].isActive = isActive;
    this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${id}`).subscribe((res) => {
      this.sprintWiseTask = res?.task;
      this.allSprint[index]['subjects'] = res?.task;
      this.isAddTask = false;
    });
  }

  createSprint(event) {
    this.getTaskById = '';
    this.selectedTaskType = 1;

    event.stopPropagation(); // Stop the event from bubbling up 
    let payload = {
      projectId: this.projectId
    };
    this.api.post('Sprint ', payload).subscribe((res) => {
      if (res) {
        this.getAllSprint();
      }
    });
  }

  async delete(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Sprint/${id}`).subscribe(
        (res) => {
          if (res) {
            this.getAllSprint();
            this.api.showToast('Sprint deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          }
        },
        (err) => {
          this.api.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }

  drop(event: any) { 

    let taskId = event.previousContainer.data[event.previousIndex].id;
    let subject = event.previousContainer.data[event.previousIndex].subject;
    let sprintId = event.container.id; 
    let status = event.container.id;
    let payload = {
      projectId: this.projectId,
      subject: subject,
      id: taskId,
      sprintId: sprintId
    };

    this.api.put(`Task/UpdateSprint?taskId=${taskId}&sprintId=${sprintId}`, payload).subscribe((res) => {
      let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
      this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      }
    });
  } 
}
