import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
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

interface Car {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-task-detail-page',
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
    FormsModule,
    // ProjectSprintTaskComponent
  ],
  templateUrl: './task-detail-page.component.html',
  styleUrls: ['./task-detail-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskDetailPageComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  @ViewChild('sprintForm') sprintForm!: NgForm;
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
  ProjectList: any = {};
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
  public selectedTaskType: number = 2;

  public projectRouteId: string = '';
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

  constructor(
    private api: CommonService,
    private _commonService: CommonService,
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


  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.projectId = this.activeRoute.snapshot.params['id'] ?? '';
    const taskId = Number(this.activeRoute.snapshot.paramMap.get('id'));

    if (taskId) {
      this.getByIdtaskWiseDetails({ id: taskId });
    }

    if (this.projectId) {
      this.getByIdtaskWiseDetails({ id: this.projectId });
    }
    this.projectTaskDetails();
  }
  getStatusLabel(status: number): string {
    const found = this.options.find((opt) => opt.value === status);
    return found ? found.label : 'Unknown';
  }

  getSelectedTaskType(type?: any) {
    const numericType = Number(type);
    return this.taskTypeList.find((item) => item.value === numericType);
  }


  getSprintStatusLabel(status: number): string {
    const sprint = this.sprintStatus.find((s) => s.status === status);
    return sprint ? sprint.value : 'Unknown';
  }

  showAddTask(index: number) {
    this.selectedTaskIndex = index;
    this.isAddTask = true;
    this.task.reset();
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

      this.projectRouteId = this.getAllTaskData.projectId;
      this.sprintId = this.getAllTaskData.sprintId;
      this.AssignUserByProject(this.projectRouteId);

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
        ProjectId: this.projectRouteId,
        taskType: item.selectedTaskType
      };

      // this.projectWiseTask[this.selectedTaskIndex].Subject = this.task.value;
      this.api.put(`Task`, payload).subscribe(
        (x) => {
          this.isDecFocus = false;
          this.api.showToast('Task Updated Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          const projectTasklist = {
            id: this.getTaskById
          };
          // this.getByIdtaskWiseDetails(projectTasklist)
          let findIndex = this.allSprint?.findIndex((x) => x.id == this.sprintId);
          this.toggleAccordion(findIndex, this.sprintId, this.allSprint[findIndex]?.isActive);
          this.selectedTaskIndex = -1;
          // this.getTaskById = '';
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
        ProjectId: this.projectRouteId,
        sprintId: this.sprintId,
        Subject: this.task?.value,
        Description: this.comment || '',
        TaskType: item.selectedTaskType,
        TaskCode: this.taskCode
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
    this.selectedTaskIndex = -1;
    this.isAddTask = false;
    this.isSubmitted = false;
    this.getTaskById = null; 
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
    this.estimatedHrs.setErrors(null);
    this.actualHrs.setErrors(null);
  }

  closedsidemanu() { 
    this.resetTaskForm();

    if (this.projectId) {
      this.router.navigate(['/new-project-page', this.projectRouteId]);
    }
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
        // case Status.Completed:
        //   return 'Completed'
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

      this.allSprint.forEach((sprint, index) => {
        this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${sprint.id}`).subscribe((taskRes) => {
          const tasks = taskRes?.task || [];
          this.sprintId = taskRes?.sprintId;
          const nonCompleted = tasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() !== 'completed');

          const completed = tasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() === 'completed');

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
    this.sprintId = id;
    this.allSprint[index].isActive = isActive;

    this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${id}`).subscribe((res) => {
      const allTasks = res?.task || [];
      this.sprintId = res?.sprintId;
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
  AssignUserByProject(projectId?: string) {
    this.api.get(`ProjectManagement/project/${projectId}`).subscribe((x) => {
      this.AssignUserByProjects = x.value.projectMembers.map((x) => x);
    });
  }

  onStatusChange(value: number | null, item: any) {
    item.selectedStatus = value;
    this.filterTasksByStatus(item);
  }

  filterTasksByStatus(item: any) {
    const sprintId = item.id;
    const statusParam = item.selectedStatus != null ? `&status=${item.selectedStatus}` : '';

    this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${sprintId}${statusParam}`).subscribe((res: any) => {
      const allTasks = res?.task || [];
      this.sprintId = res?.sprintId;
      item.subjects = [...allTasks];
      item.filteredTasks = allTasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() !== 'completed');
      item.completedTasks = allTasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() === 'completed');

      this.allSprint = [...this.allSprint];
    });
  }

  onPriorityChange(value: Priority | null, item: any) {
    item.selectedPriority = value;
    this.filterTasksByPriority(item);
  }

  filterTasksByPriority(item: any) {
    const sprintId = item.id;
    const priorityParam = item.selectedPriority != null ? `&priority=${item.selectedPriority}` : '';

    this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${sprintId}${priorityParam}`).subscribe((res: any) => {
      const allTasks = res?.task || [];
      this.sprintId = res?.sprintId;
      item.subjects = [...allTasks];
      item.filteredTasks = allTasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() !== 'completed');
      item.completedTasks = allTasks.filter((task) => this.getStatusLabel(task.status)?.toLowerCase() === 'completed');

      this.allSprint = [...this.allSprint];
    });
  }

  showTaskTypeDropdown = false;
  toggleTaskTypeDropdown(item: any) {
    item.showTaskTypeDropdown = !item.showTaskTypeDropdown;
  }



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

  saveDescription() {

    const trimmedSubject = this.task.value?.trim() || '';
    const trimmedDescription = this.description.value?.trim() || '';

    this.task.setValue(trimmedSubject, { emitEvent: false });
    this.description.setValue(this.getAllTaskData?.description || '', { emitEvent: false });

    if (!trimmedSubject) {
      this.isSubmitted = true;
      return;
    }

    if (this.task.invalid && !this.isDecFocus) {
      this.isSubmitted = true;
      return;
    }
    const payload: any = {
      id: this.getTaskById,
      ProjectId: this.projectRouteId,
      Subject: trimmedSubject,
      Description: trimmedDescription,
      sprintId: this.sprintId,
      TaskCode: this.taskCode,
      taskType: this.getAllTaskData?.taskType ?? this.selectedTaskType,
      status: this.getAllTaskData?.status ?? 0
    };

    if (this.getTaskById) {
      payload['id'] = this.getTaskById;

      this.api.put(`Task`, payload).subscribe({

        next: () => {
          this.isDecFocus = false;
          this.api.showToast('Description Updated Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);

          if (this.getTaskById) {
            this.getByIdtaskWiseDetails({ id: this.getTaskById });
          }

          this.selectedTaskIndex = -1;
        },
        error: (error) => {
          const errorMsg = error?.error?.message || 'Something went wrong.';
          this.api.showToast(errorMsg, ToastType.ERROR, ToastType.ERROR);
        }
      });
    } else {
      this.api.post(`Task`, payload).subscribe({
        next: () => {
          this.api.showToast('Description added successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          this.projectTaskDetails();
          this.selectedTaskIndex = -1;
        },
        error: (error) => {
          const errorMsg = error?.error?.message || 'Something went wrong.';
          this.api.showToast(errorMsg, ToastType.ERROR, ToastType.ERROR);
        }
      });
    }
  }

  projectTaskDetails() {
    this.api.get(`Task/project/${this.projectId}`).subscribe((x) => {
      this.projectWiseTask = x;
      this.getProjecttaskData = x;
      this.projectName = x?.length ? x[0].projectName : null;
    });
  }

  onEnterPress(event: any) {
    // OR better: (event: KeyboardEvent)
    const keyboardEvent = event as KeyboardEvent;

    // Optional safety check
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.saveDescription();
    }
  }
}
