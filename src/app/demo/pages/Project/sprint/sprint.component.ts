import { Component, ElementRef, HostListener, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ChartComponent,
  NgApexchartsModule,
  ApexPlotOptions,
  ApexStroke
} from 'ng-apexcharts';

import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectTreeViewComponent } from '../../treeview/project-tree-view/project-tree-view.component';
import { ProjectTaskboardComponent } from '../project-taskboard/project-taskboard.component';
import { ProjectSprintTaskComponent } from '../project-sprint-task/project-sprint-task.component';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { data } from '../../email-setting/emailsetting.model';

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

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip?: any;
  options: string;
  plotOptions: ApexPlotOptions;
};
interface Car {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-sprint',
  standalone: true,
  imports: [
    SharedModule,
    DragDropModule,
    AngularEditorModule,
    NgApexchartsModule,
    MatExpansionModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
    // ProjectSprintTaskComponent
  ],
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SprintComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('sprintForm') sprintForm!: NgForm;
  public chartOptions: Partial<ChartOptions>;
  showPopup = false;
  projectAllData: any;
  form: FormGroup;
  task: FormControl = new FormControl('', [Validators.required]);
  description: FormControl = new FormControl('', [Validators.required]);
  assignDueDate: FormControl = new FormControl('', [Validators.required]);
  public getProjecttaskData: any[];
  selectedTaskIndex: number = -1;
  projectWiseTask: any = [];
  loading: boolean = false;
  isCreateTaskVisible: boolean = false;
  AssignUserByProjects: any;
  taskStatus: number = 1;
  projectName: any;
  public sprintStatus: any[] = [
    { status: 0, value: 'Start' },
    { status: 1, value: 'Current' },
    { status: 2, value: 'On Hold' },
    { status: 3, value: 'Completed' }
  ];
  sprintTask: any;
  item: any;
  editingTaskId: any;
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
  StartDate: Date;
  EndDate: Date;
  projectId: any;
  getAllTaskData: any = null;
  isAddTask: boolean = false;
  isDecFocus: boolean = false;
  isSubmitted: boolean = false;
  userDetail;
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
  taskConversion: any;
  public timeLineData: any[] = [];
  attechments: any;
  dueDateFormate: any;
  editTaskId: any;
  personId: any;
  changeStatus: any;
  uploadedlogo: any[] = [];
  projectTaskListArray: any[] = [];
  allTasks: any[] = []; 
  comment: any = '';
  isEditingTask: any;
  isTimeLine = false;
  expandedIndex: number | null = null;
  selectedSprint: any;
  public searchDataValue: string = '';
  public allSprint: any;
  public sprintId: any;
  public sprintWiseTask: any;
  public isDisplay: boolean = false;
  isAddingTask = false;
  cardData: any;
  originalSprintList: any[] = [];
  public editSprintIndex: number | null = null;
  sprintNameControl = new FormControl('', Validators.required);
  @ViewChild('sprintInput') sprintInput!: ElementRef;
  @ViewChild('search') search: ElementRef;
  Status: any;
  selectedTaskType: any = null;

  estimatedHrs = new FormControl('', [Validators.required, Validators.pattern(/^(?!0+(?:\.0{1,2})?$)\d+(\.\d{1,2})?$/)]);
  actualHrs = new FormControl('', [Validators.required, Validators.pattern(/^(?!0+(?:\.0{1,2})?$)\d+(\.\d{1,2})?$/)]);
  commentEditorConfig: AngularEditorConfig = {
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

  descriptionEditorConfig: AngularEditorConfig = {
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
    { name: 'Story', value: TaskType.Story, image: 'ri-bookmark-line' },
    { name: 'Task', value: TaskType.Task, image: 'ri-checkbox-line' },
    { name: 'Issue', value: TaskType.Issue, image: 'ri-bug-line' }
  ];

  sprintName: any;
  sprintCode: any;
  alldata: any;
  taskCode: any;
  targetSprint: any;
  connectedSprintIds: string[] = [];
  taskRequests: string;

  constructor(
    private api: CommonService,
    private elRef: ElementRef,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private router: Router,
    private sweetlalert: SweetalertService
  ) {
    this.form = this.fb.group({
      Comment: [''],
      description: this.description
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

  options = [
    { label: 'Available', value: 0 },
    { label: 'Assigned', value: 1 },
    { label: 'In-Progress', value: 2 },
    { label: 'In-Review', value: 3 },
    { label: 'Re-Open', value: 4 },
    { label: 'Completed', value: 5 }
  ];
  selectedOption = this.options[0].value;
  selectedOption1 = this.options[1].value;
  selectedOption2 = this.options[2].value;
  selectedOption3 = this.options[3].value;
  selectedOption4 = this.options[4].value;
  selectedOption5 = this.options[5].value;
  colorMap = {
    0: '#ff4365', // Available
    1: '#1890ff', // Assigned
    2: '#1fc970', // In-Progress
    3: '#fecd21', // In-Review
    4: '#962eee', // Re-Open
    5: '#ee2ed1' // Completed
  };

  taskStatusList = [
    { key: 'available', label: 'Available', color: '#ff4365' },
    { key: 'assigned', label: 'Assigned', color: '#1890ff' },
    { key: 'inProgress', label: 'In Progress', color: '#1fc970' },
    { key: 'inReview', label: 'In Review', color: '#fecd21' },
    { key: 'reOpen', label: 'Re-Open', color: '#962eee' },
    { key: 'completed', label: 'Completed', color: '#ee2ed1' },
    { key: 'rejected', label: 'Rejected', color: '#999999' }
  ];
  dropTask(event: CdkDragDrop<any[]>, targetSprint: any): void {
    const draggedTask = event.item.data;

    const sourceSprint = this.allSprint.find((s) => s.filteredTasks.some((t) => t.id === draggedTask.id));

    // if (!sourceSprint || sourceSprint.id === targetSprint.id) return;
    if (!sourceSprint || !draggedTask || sourceSprint.id === targetSprint.id) {
      return;
    }

    if (+targetSprint.status === SprintStatus.Completed) {
      this.api.showToast('Cannot move task to a completed sprint.', ToastType.WARNING, ToastType.WARNING);
      return;
    }

    // Select only dragged task
    sourceSprint.filteredTasks.forEach((t) => (t.selected = false));
    draggedTask.selected = true;

    // Move it
    this.moveSelectedTasksToSprint(sourceSprint.id, targetSprint.id);
  }

  toggleSelectAllTasks(sprint: any) {
    if (sprint?.filteredTasks?.length) {
      sprint.filteredTasks.forEach((task: any) => {
        task.selected = sprint.selectAll;
      });
    }
  }

  updateSelectedStatus(sprint: any): void {
    const tasks = sprint.filteredTasks;
    sprint.selectAll = tasks.every((t: any) => t.selected);
  }
  getMovableSprints(currentSprintId: number): any[] {
    return this.allSprint.filter((s) => s.id !== currentSprintId && s.status !== SprintStatus.Completed);
  }

  moveSelectedTasksToSprint(fromSprintId: string, toSprintId: string): void {
    const fromSprint = this.allSprint.find((s) => s.id === fromSprintId);
    const selectedTasks = fromSprint?.filteredTasks?.filter((t) => t.selected) || []; 

    if (!selectedTasks.length) {
      this.api.showToast('Please select tasks to move.', ToastType.WARNING, ToastType.WARNING);
      return;
    }

    const updateRequests = selectedTasks.map((task) => {
      const updatedTask = {
        id: task.id,
        subject: task.subject || task.Subject || '',
        description: task.description || task.Description || '',
        status: task.status,
        ProjectId: this.projectId,
        SprintId: toSprintId,
        TaskCode: task.taskCode || task.TaskCode || '',
        taskType: task.taskType
      };

      return this.api.put('Task', updatedTask).toPromise();
    });

    Promise.all(updateRequests)
      .then(() => {
        this.api.showToast('Task moved successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.getAllSprint(); // Refresh sprint/task list
      })
      .catch((err) => {
        this.api.showToast('Failed to move tasks.', ToastType.ERROR, ToastType.ERROR);
      });
  }

  getValidTargetSprints(currentSprintId: number) {
    return this.allSprint.filter((s) => s.id !== currentSprintId && s.status !== this.sprintType.Completed);
  }

  moveTaskToSprint(task: any, targetSprintId: string): void {
    const updatedTask = {
      ...task,
      SprintId: targetSprintId,
      ProjectId: this.projectId,
      subject: task.subject || task.Subject,
      description: task.description || task.Description,
      taskCode: task.taskCode || task.TaskCode,
      taskType: task.taskType,
      status: task.status
    };

    this.api.put('Task', updatedTask).subscribe({
      next: () => {
        this.api.showToast('Task moved successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.getAllSprint();
      },
      error: () => {
        this.api.showToast('Failed to move tasks.', ToastType.ERROR, ToastType.ERROR);
      }
    });
  }
  hasSelectedTasks(sprint: any): boolean {
    return sprint?.filteredTasks?.some((t: any) => t.selected);
  }

  openPopup() {
    this.showPopup = true;

    if (this.selectedSprint) {
      // Pre-fill the form with existing sprint data
      this.sprintCode = this.selectedSprint.sprintCode;
      this.sprintName = this.selectedSprint.sprintName;
      this.StartDate = new Date(this.selectedSprint.startDate);
      this.EndDate = new Date(this.selectedSprint.endDate);
    } else {
      // Clear the form for new sprint
      this.sprintCode = '';
      this.sprintName = '';
      this.StartDate = null;
      this.EndDate = null;
    }
  }

  closePopup() {
    this.showPopup = false;
    this.selectedSprint = null;
    this.editSprintIndex = null;
    if (this.sprintForm) this.sprintForm.resetForm();
  }

  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.projectId = this.activeRoute.snapshot.params['id'] ?? '';
    let task: any = this.activeRoute.snapshot.queryParams ?? null; 
    this.getAllSprint(); 
    this.AssignUserByProject();
    this.selectedTaskType = TaskType.Task; 
  }
  getStatusLabel(status: number): string {
    const found = this.options.find((opt) => opt.value === status);
    return found ? found.label : 'Unknown';
  } 
  getSelectedTaskType(type: any): any {
    return this.taskTypeList.find((item) => Number(item.value) === Number(type));
  }
  getFilteredSprintStatus(currentStatus: number) {
    if (currentStatus === SprintStatus.Current) {
      return this.sprintStatus.filter((s) => s.status === SprintStatus.OnHold || s.status === SprintStatus.Completed);
    }

    if (currentStatus === SprintStatus.OnHold) {
      return this.sprintStatus.filter((s) => s.status === SprintStatus.NotStarted || s.status === SprintStatus.Completed);
    }

    return [];
  }

  getSprintStatusLabel(status: number): string {
    const sprint = this.sprintStatus.find((s) => s.status === status);
    return sprint ? sprint.value : 'Unknown';
  }

  onSprintEdit(sprint: any, index: number) {
    this.editSprintIndex = index;
    this.selectedSprint = sprint;

    this.sprintName = sprint.sprintName;
    this.StartDate = sprint.startDate ? new Date(sprint.startDate) : null;
    this.EndDate = sprint.endDate ? new Date(sprint.endDate) : null;

    this.showPopup = true;

    setTimeout(() => {
      this.sprintInput?.nativeElement.focus();
    }, 100);
  }

  showAddTask(index: number) {
    this.selectedTaskIndex = index;
    this.isAddTask = true;
    this.task.reset();
  }

  toggleCreateTask(): void {
    this.isCreateTaskVisible = !this.isCreateTaskVisible;
  }

  onSprintStatusUpdate(id: number, status: any) {
    if (status === 0) status = 1;
    const projectId = this.projectId;
    this.api.put(`Sprint/StartSprint?sprintId=${id}&Status=${status}&projectId=${projectId}`, '').subscribe(
      (res) => {
        if (res.statusCode === 200) {
          this.api.showToast('Sprint started successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          const sprint = this.allSprint.find((s) => s.id === id);
          if (sprint) sprint.status = status;
        } else if (res.statusCode === 400) {
          this.api.showToast(res?.errors[0]?.errorMessage, ToastType.WARNING, ToastType.WARNING);
        }
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

  navigateToTaskDetail(taskId: number) {
    this.router.navigate(['/task-detail', taskId]);
  }
  getByIdtaskWiseDetails(projectTasklist) {
    this.getAllTaskData = null;
    this.estimatedHrs.setValue(null);
    this.actualHrs.setValue('');

    this.actualHrs = new FormControl('', [Validators.required, Validators.pattern(/^(?!0+(?:\.0{1,2})?$)\d+(\.\d{1,2})?$/)]);
    this.estimatedHrs.enable();

    this.api.get(`Task/${projectTasklist.id}`).subscribe((x) => {
      this.getAllTaskData = x?.length ? x[0] : null;
      this.task.setValue(this.getAllTaskData.subject);
      this.comment = this.getAllTaskData?.description;
      this.taskCode = this.getAllTaskData?.taskCode || '';
      this.getTaskById = projectTasklist.id;
      this.description.setValue(this.getAllTaskData?.description || '');
      this.getAllTaskData.taskType = Number(this.getAllTaskData?.taskType ?? 0);
      this.getAllconversation();
      this.getAllFollewers();
      this.getTimeline();
      this.getTimeline();
      this.getActualHours();
      let estimatedHours = this.getAllTaskData.estimateHours;
      if (estimatedHours !== null) {
        this.estimatedHrs.setValue(estimatedHours);
        this.estimatedHrs.disable();
        this.estimatedHrsSaved = true;
      }
      if (this.getAllTaskData.status === 5) {
        this.estimatedHrs.disable();
        this.actualHrs.disable();
      } else {
        this.actualHrs.enable();
      }
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

  searchData(value: string) {
    if (value == '') {
      this.allSprint = [...this.originalSprintList];
    } else {
      this.allSprint = this.originalSprintList.filter((item) => {
        return (
          item?.sprintName?.toLowerCase().includes(value.toLowerCase()) || item?.sprintCode?.toLowerCase().includes(value.toLowerCase())
        );
      });
    }
  }

  saveTask(sprintId: string, item: any, status?: any) {
    this.sprintId = sprintId;

    if (this.task.value) {
      const trimmedValue = this.task.value.trim();
      this.task.setValue(trimmedValue || '', { emitEvent: false });

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
        subject: this.task?.value,
        description: this.comment || '',
        status: selectedStatus,
        SprintId: this.sprintId,
        TaskCode: this.taskCode || item?.TaskCode || item?.taskCode || '',
        ProjectId: this.projectId,
        TaskType: this.selectedTaskType,
        taskRequets: this.taskRequests || ''
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
          this.getAllSprint();
          this.selectedTaskIndex = -1; 
        },
        (error) => {
          if (payload?.description === '') {
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
        TaskType: this.selectedTaskType,
        TaskCode: this.taskCode,
        taskRequets: this.taskRequests || ''
      };
      payload = this.comment ? { ...payload, Description: this.comment } : payload;

      this.api.post(`Task`, payload).subscribe(
        (x) => {
          this.api.showToast('Task added successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
          this.getAllSprint();
          this.selectedTaskIndex = -1;
          this.selectedTaskType = TaskType.Task; 
          this.isAddTask = false;
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

  onEnterKey(task: any) {
    this.updateTask(task);
    this.getTaskById = null;
  }

  updateTask(task: any) {
    if (!task || !task.id || !task.subject) {
      return;
    }

    const trimmedSubject = task.subject.trim();
    task.subject = trimmedSubject || '';

    if (!trimmedSubject) {
      this.api.showToast('Task subject cannot be empty.', ToastType.ERROR, ToastType.ERROR);
      return;
    }
    const payload = {
      id: this.getTaskById,
      projectId: this.projectId,
      sprintId: this.sprintId,
      TaskCode: task?.taskCode || '',
      TaskType: task?.taskType || '',
      subject: task.subject,
      description: this.comment || '',
      status: task.status
    };

    this.api.put('Task', payload).subscribe(
      (response) => {
        this.api.showToast('Task updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
      },
      (error) => {
        this.api.showToast('Something went wrong .', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }

  handleEditorBlur(item: any) {
    if (this.comment.trim()) {
      this.saveTask(this.sprintId, item);
    }
  }

  onTaskEdit(task: any, sprintId: any) {
    this.getTaskById = task.id;
    this.sprintId = sprintId;
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    }, 100);
  }

  closeAddTaskForm() {
    this.task.reset();
    this.selectedTaskType = TaskType.Task;
    this.selectedTaskIndex = -1;
    this.isAddTask = false;
    this.isSubmitted = false;
    this.getTaskById = null;
    this.selectedTaskType = 'Task'; 
  }
  closeFileInput() {
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
    formData.append('Comment', this.form.get('Comment').value?.trim() || '');
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
    this.selectedSprint = null;
    this.editSprintIndex = null;
  }
  getAllconversation() { 
    this.api.get(`Task/conversion/${this.getTaskById}`).subscribe((x) => {
      if (x.statusCode == 200) {
        this.taskConversion = x.value;
      }
    });
  } 

  searchText: string = '';

  filteredAssignUsers() {
    if (!this.searchText) {
      return this.AssignUserByProjects;
    }
    const lower = this.searchText.toLowerCase();
    return this.AssignUserByProjects.filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(lower));
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
      this.api.put(`Task/assign?taskId=${this.getTaskById}&assignedId=${Asssignid?.personId}`, {}).subscribe(
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
      this.api.delete(`Task/${projectTasklist.id}`).subscribe(
        (res) => {
          this.isTaskDetailsDisable = false;
          if (res?.value === 'Task is already assigned to someone.') {
            this.api.showToast(res?.value, ToastType.WARNING, ToastType.WARNING);
          } else {
            this.api.showToast(`Task deleted successfully.`, ToastType.SUCCESS, ToastType.SUCCESS);
            this.getAllSprint();
          }
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordionUI(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
        },
        (error) => {
          this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }
  toggleAccordionUI(index: number, id, isActive) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    this.sprintId = id;
    this.allSprint[index].isActive = isActive;
  }

  updateDueDate(data) {
    this.dueDateFormate = this.datepipe.transform(data, 'yyyy/MM/dd');
    this.api.put(`Task/dueDate?taskId=${this.getTaskById}&dueDate=${this.dueDateFormate} `, {}).subscribe(
      (x) => {
        this.api.showToast('Task due date updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        const projectTasklist = {
          id: this.getTaskById
        };
        this.getByIdtaskWiseDetails(projectTasklist);
        this.assignDueDate.reset();
      },
      (error) => {
        this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR);
      }
    );
  }
  showEstimatedValidation = true;
  showActualValidation = true;
  resetTaskForm() {
    this.estimatedHrs.reset();
    this.actualHrs.reset();
    this.showEstimatedValidation = false;
    this.showActualValidation = false;

    // Optional: Clear any custom errors if still present
    this.estimatedHrs.setErrors(null);
    this.actualHrs.setErrors(null);
  }

  closedsidemanu() { 
    this.getTaskById = null;
    this.resetTaskForm();
    this.filterTasksByPerson(this.selectedPersonId || ''); 
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
  getCompletedTasks(item: any): any[] {
    const tasks = this.selectedPersonId ? item.filteredTasks : item.subjects;
    return tasks?.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() === 'completed') || [];
  }
  getAllSprint() {
    this.loading = true;
    this.api.get(`Sprint/GetAllSprintByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      this.loading = false;

      const formattedSprintList = res.map((sprint) => ({
        ...sprint,
        selectedTaskType: 2,
        subjects: [],
        filteredTasks: [],
        completedTasks: []
      }));

      this.originalSprintList = [...formattedSprintList];
      this.allSprint = [...formattedSprintList];
      this.connectedSprintIds = this.allSprint.filter((s) => s.status !== this.sprintType.Completed).map((s) => `sprintDropList_${s.id}`);
      this.allSprint.forEach((sprint, index) => {
        this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${sprint.id}`).subscribe((taskRes) => {
          const tasks = taskRes?.task || [];

          const nonCompleted = tasks
            .filter((task) => this.getStatusLabel(task.status)?.toLowerCase() !== 'completed')
            .map((task) => ({ ...task, selected: false }));

          const completed = tasks
            .filter((task) => this.getStatusLabel(task.status)?.toLowerCase() === 'completed')
            .map((task) => ({ ...task, selected: false }));

          const updatedSprint = {
            ...this.allSprint[index],
            subjects: tasks,
            filteredTasks: nonCompleted,
            completedTasks: completed
          };

          this.allSprint[index] = updatedSprint;
          this.originalSprintList[index] = updatedSprint;

          this.allSprint = [...this.allSprint];
        });
      });
    });
  } 

  getPriorityName(priorityValue: number): string {
    const priority = this.priorityList.find((p) => p.value === priorityValue);
    return priority ? priority.name : '';
  } 
  toggleAccordion(index: number, id, isActive) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
    this.selectedPersonId = '';
    this.filterTasksByPerson('');
    this.sprintId = id;
    this.allSprint[index].isActive = isActive;

    this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${id}`).subscribe((res) => {
      const allTasks = res?.task || [];

      this.sprintWiseTask = allTasks;

      this.allSprint[index]['allTasks'] = allTasks;

      this.allSprint[index]['completedTasks'] = allTasks.filter((t) => this.getStatusLabel(t.status)?.toLowerCase() === 'completed');

      const activeTasks = allTasks.filter((t) => this.getStatusLabel(t.status)?.toLowerCase() !== 'completed');

      this.allSprint[index]['subjects'] = activeTasks;
      this.allSprint[index]['filteredTasks'] = activeTasks;

      this.isAddTask = false;
      this.isCreateTaskVisible = false;
    });
  }

  createSprint(event: Event) {
    event.preventDefault();
    if (this.sprintName) {
      this.sprintName = this.sprintName.trim();
    }

    if (this.sprintForm.invalid) {
      this.sprintForm.form.markAllAsTouched();
      return;
    }
    const payload = {
      projectId: this.projectId,
      sprintCode: this.selectedSprint ? this.selectedSprint.sprintCode : this.sprintCode,
      sprintName: this.sprintName,
      startDate: formatDate(this.StartDate, 'yyyy-MM-dd', 'en-US'),
      endDate: formatDate(this.EndDate, 'yyyy-MM-dd', 'en-US')
    };

    if (this.selectedSprint) {
      payload['id'] = this.selectedSprint.id;
      this.updateSprint(payload);
    } else {
      this.createNewSprint(payload);
    }
  }

  private updateSprint(payload: any) {
    this.api.put('Sprint', payload).subscribe((res) => {
      if (res) {
        this.api.showToast('Sprint Updated Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        this.handleSprintSuccess();
      }
    });
  }

  private createNewSprint(payload: any) {
    this.api.post('Sprint', payload).subscribe((res) => {
      if (res) {
        this.api.showToast('Sprint Created Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        this.handleSprintSuccess();
      }
    });
  }

  private handleSprintSuccess() {
    this.getAllSprint();
    this.closePopup();
    this.sprintForm.resetForm();
    this.selectedSprint = null;
    this.editSprintIndex = null;
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
  selectedPersonId: string = '';
  AssignUserByProject() {
    this.api.get(`ProjectManagement/project/${this.projectId}`).subscribe((x) => {
      this.AssignUserByProjects = x.value.projectMembers;
      this.projectName = x.value.projectName;
    });
  }

  onStatusChange(value: number | null, item: any) {
    item.selectedStatus = value;
    this.applyAllFilters(item);
  }

  onPriorityChange(value: Priority | null, item: any) {
    item.selectedPriority = value;
    this.applyAllFilters(item);
  }

  onTaskTypeChange(value: any, item: any) {
    item.selectedTaskType = value;
    this.applyAllFilters(item);
  }

  filterTasksByPerson(personId: string) {
    this.selectedPersonId = personId;

    if (this.expandedIndex === null) return;

    const selectedSprint = this.allSprint[this.expandedIndex];

    // Apply filter only if sprint status is 'Current'
    if (selectedSprint.status !== SprintStatus.Current) return;

    selectedSprint.selectedTaskType = null;
    this.applyAllFilters(selectedSprint);
  }

  applyAllFilters(item: any) {
    const requestPayload = {
      sprintId: item.id,
      taskType: item.selectedTaskType ?? null,
      priority: item.selectedPriority ?? null,
      status: item.selectedStatus ?? null,
      TaskAssignId: this.selectedPersonId || null
    };

    this.api.post(`Sprint/GetTaskBySprint`, requestPayload).subscribe((res: any) => {
      const allTasks = res?.task || [];

      item.subjects = [...allTasks];
      item.filteredTasks = allTasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() !== 'completed');
      item.completedTasks = allTasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() === 'completed');

      this.allSprint = [...this.allSprint];
    });
  }

  public chatMessage: string = ''; 

  editorConfig: AngularEditorConfig = {
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

  // time estimation
  private estimatedHrsSaved = false;
  public actualHourList: any[] = [];
  onEstimateEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (this.estimatedHrs.invalid) {
      keyboardEvent.preventDefault();
      this.estimatedHrs.markAsTouched();
      return;
    }

    this.saveEstimateHours();
  }

  onActualEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (this.actualHrs.invalid) {
      keyboardEvent.preventDefault();
      this.actualHrs.markAsTouched();
      return;
    }

    this.saveActualHours();
  }
  saveEstimateHours() {
    if (this.estimatedHrs.value) {
      let payload = {
        TaskId: this.getTaskById,
        EstimateHours: this.estimatedHrs.value
      };
      this.api.put(`Task/UpdateEstimateHour`, payload).subscribe(
        (res) => {
          this.api.showToast('Estimated hours saved successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          if (!this.estimatedHrsSaved) {
            this.estimatedHrs.disable();
            this.estimatedHrsSaved = true;
          }
        },
        (err) => {
          this.api.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  }
  saveActualHours() {
    if (this.actualHrs.value) {
      let payload = {
        TaskId: this.getTaskById,
        ActualHours: this.actualHrs.value
      };
      this.api.post(`Task/AddActualTask`, payload).subscribe(
        (res) => {
          this.api.showToast('Actual hours saved successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getActualHours();
          this.actualHrs.reset();
        },
        (err) => {
          this.api.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
        }
      );
    }
  } 

  getActualHours() {
    this.api.get(`Task/ActualTask?taskId=${this.getTaskById}`).subscribe((res) => {
      this.actualHourList = res;
    });
  } 
  trimOnBlur(field: FormControl) {
    if (!field?.value || !field.value.toString().trim()) {
      field.setValue('', { emitEvent: false });
      field.markAsPristine();
      field.markAsUntouched();
    } else {
      const trimmedValue = field.value.toString().trim();
      field.setValue(trimmedValue, { emitEvent: false });
    }
    field.updateValueAndValidity();
  } 

  projectTaskDetails() {
    this.api.get(`Task/project/${this.projectId}`).subscribe((x) => {
      this.projectWiseTask = x;
      this.getProjecttaskData = x;
      this.projectName = x?.length ? x[0].projectName : null;
    });
  } 
}
