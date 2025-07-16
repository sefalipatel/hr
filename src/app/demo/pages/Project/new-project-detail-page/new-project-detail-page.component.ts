import { Component, ElementRef, HostListener, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
interface Food {
  value: string;
  viewValue: string;
}
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProjectTreeViewComponent } from '../../treeview/project-tree-view/project-tree-view.component';
import { ProjectTaskboardComponent } from '../project-taskboard/project-taskboard.component';
import { ProjectSprintTaskComponent } from '../project-sprint-task/project-sprint-task.component';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DatePipe, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { SprintComponent } from '../sprint/sprint.component';
import { MatTabChangeEvent } from '@angular/material/tabs';

export enum Status {
  Available = 0,
  Assigned = 1,
  InProgress = 2,
  InReview = 3,
  ReOpen = 4,
  Completed = 5
}

export enum ProjectStatus
{
    InProgress = 1,
    Complete = 2,
    OnHold = 3,
    Backlog = 4
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
@Component({
  standalone: true,
  imports: [
    SharedModule,
    NgApexchartsModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ProjectTaskboardComponent,
    ProjectTreeViewComponent,
    ProjectSprintTaskComponent,
    SprintComponent
  ],
  selector: 'app-new-project-detail-page',
  templateUrl: './new-project-detail-page.component.html',
  styleUrls: ['./new-project-detail-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewProjectDetailPageComponent {
  scrollToTop() {
    this.scroller.scrollToPosition([0, 0]);
  }

  @ViewChild('chart') chart: ChartComponent;
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
  sprintTask: any;
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
  dueDateFormate: any;
  personId: any;
  changeStatus: any;
  uploadedlogo: any[] = [];
  projectTaskListArray: any[] = [];
  projectName: any;
  timeLineData: any;
  comment: any = '';
  isTimeLine = false;
  userDetail;
  userProfile: any;
  public attachmentUrl: string = environment.apiUrl.replace('api/', '');
  expandedIndex: number | null = null;
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
  projectCode: any;
  projectCategoryId: any;
  sprintList: any[] = [];
  currentSprint: any = null;
  projectCategory: any;
  categoryName: any;
  clientId: any;
  projectManager: any;
  projectOwner: any;
  showSprintComponent = true;

  originalSprintList: any[] = [];
  startDate: any;
  endDate: any;
  statusName: string;
  priority: any;
  priorityName: string;
  technologySpecification: any;
  notes: any;
  organizationId: any;
  projectAttachments: any;
  taskStatusCounts: any;
  selectedIndex: number = 0;
  constructor(
    private api: CommonService,
    private elRef: ElementRef,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private router: Router,
    private elementRef: ElementRef,
    private sweetlalert: SweetalertService, private scroller: ViewportScroller
  ) {
    this.form = this.fb.group({
      Comment: ''
    });
    this.chartOptions = {
      series: [],
      chart: {
        type: 'donut'
      },
      colors: [],
      labels: [],
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 10,
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true
            }
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }

  initializeEmptyChart() {
    this.chartOptions = {
      series: [100],
      chart: {
        type: 'donut',
        width: 400
      },
      labels: ['No Data'],
      colors: ['#E5E7EB'],
      dataLabels: {
        enabled: true
      },
      legend: {
        show: false
      }
    };
  }

  @ViewChild('editorContainer') editorContainer!: ElementRef;
  isEditorTouched: boolean = false;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.editorContainer && !this.editorContainer.nativeElement.contains(event.target)) {
      if (this.isEditorTouched) {
        this.isEditorTouched = false;
      }
    }
  }
  options = [
    { label: 'Available', value: 1 },
    { label: 'Assigned', value: 2 },
    { label: 'In-Progress', value: 3 },
    { label: 'In-Review', value: 4 },
    { label: 'Re-Open', value: 5 },
    { label: 'Completed', value: 6 }
  ];
  selectedOption = this.options[0].value;
  selectedOption1 = this.options[1].value;
  selectedOption2 = this.options[2].value;
  selectedOption3 = this.options[3].value;
  selectedOption4 = this.options[4].value;
  selectedOption5 = this.options[5].value;

  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.projectId = this.activeRoute.snapshot.params['id'] ?? '';
    let task: any = this.activeRoute.snapshot.queryParams ?? null;

    this.AssignUserByProject();
    this.getProjectMember();
    
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.reloadSprintComponent();
    }
  }

  reloadSprintComponent() {
    this.showSprintComponent = false;
    setTimeout(() => (this.showSprintComponent = true));
  }

  getSprintStatusLabel(status: number): string {
    const sprint = this.sprintStatus.find((s) => s.status === status);
    return sprint ? sprint.value : 'Unknown';
  }

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }
  getFileExtension(filePath: string): string {
    const parts = filePath.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  }
  onBoardTabClick() {
    this.getAllSprint();
  }
  onBacklogClick() {
    this.loading = true;
    this.api.get(`Sprint/GetAllSprintByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      this.loading = false;

      const formattedSprintList = res.map((sprint) => ({
        ...sprint,
        selectedTaskType: 2,
        subjects: []
      }));

      this.originalSprintList = [...formattedSprintList];
      this.allSprint = [...formattedSprintList];

      // Fetch tasks for each sprint
      this.allSprint.forEach((sprint, index) => {
        this.api.get(`Sprint/GetAllTaskBySprintId?sprintId=${sprint.id}`).subscribe((taskRes) => {
          this.allSprint[index].subjects = taskRes?.task || [];
          this.originalSprintList[index].subjects = taskRes?.task || [];
        });
      });
    });
  }
  getAllSprint() {
    this.api.get(`Sprint/GetAllSprintByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      // if (res) {
      this.sprintList = res;
      let currentSprintVal = res.find((sprint) => sprint.status === 0);
      this.currentSprint = currentSprintVal?.id;
      // }
    });
  }
  AssignUserByProject() {
    this.api.get(`ProjectManagement/project/${this.projectId}`).subscribe((x: any) => {
      const value = x.value;

      this.AssignUserByProjects = value.projectMembers;
      this.projectId = value.projectId;
      this.projectName = value.projectName;
      this.projectCode = value.projectCode;
      this.projectCategoryId = value.projectCategoryId;
      this.projectCategory = value.projectCategory;
      this.categoryName = value.categoryName;
      this.clientId = value.clientId;

      this.projectManager = value.projectManager?.employeeName;
      this.projectOwner = value.projectOwner?.employeeName;
      this.startDate = value.startDate?.split('T')[0];
      this.endDate = value.endDate?.split('T')[0];
      this.statusName = ProjectStatus[value.status];
      this.priority = value.priority;
      this.priorityName = this.priorityList.find((p) => p.value === this.priority)?.name || 'Unknown';
      this.description = value.description;
      this.technologySpecification = value.technologySpecification;
      this.notes = value.notes;
      this.organizationId = value.organizationId;

      this.projectAttachments = value.projectAttachments;
      this.taskStatusCounts = value.taskStatusCounts;

      const statusMap = {
        available: { label: 'Available', color: '#ff4365' },
        assigned: { label: 'Assigned', color: '#1890ff' },
        inProgress: { label: 'In-Progress', color: '#1fc970' },
        inReview: { label: 'In Review', color: '#fecd21' },
        reOpen: { label: 'Reopen', color: '#962eee' },
        completed: { label: 'Completed', color: '#ee2ed1' },
        rejected: { label: 'Rejected', color: '#d9534f' }
      };

      const series: number[] = [];
      const labels: string[] = [];
      const colors: string[] = [];

      for (const key in this.taskStatusCounts) {
        const count = this.taskStatusCounts[key];
        if (count > 0 && statusMap[key]) {
          series.push(count);
          labels.push(statusMap[key].label);
          colors.push(statusMap[key].color);
        }
      }

      if (series.length === 0) {
        this.initializeEmptyChart();
      } else {
        this.chartOptions = {
          ...this.chartOptions,
          series,
          labels,
          colors
        };
      }
    });
  } 
  closedsidemanu() {
    this.isTaskDetailsDisable = false;
    this.getAllTaskData = null;
    this.getTaskById = null;
    this.getAllSprint();
  }

  navigate() {
    this.router.navigateByUrl('/project-dashboard');
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

  getTimeline() {
    this.api.get(`Task/timeline/${this.getTaskById}`).subscribe((x) => {
      this.timeLineData = x;
    });
  }
  onTimeLineChange() {
    this.isTimeLine = !this.isTimeLine;
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

  getProjectMember() {
    this.api.get(`ProjectMembers/GetListByProjectId?projectId=${this.projectId}`).subscribe((res) => {
      this.userProfile = res;
      if (res?.length) {
        this.userDetail = res[0];
      }
    });
  }
  getAttachmentUrl(filePath: string): string {
    const cleanedPath = filePath.replace(/\\/g, '/').replace(/^wwwroot\//, '');
    return `${this.attachmentUrl}${cleanedPath}`;
  }

  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part.charAt(0)).join('');
    return initials.toUpperCase();
  }
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }

  getFileName(filePath: string): string {
    return filePath.split('\\').pop() || filePath;
  }

  onProjectPage() {
    this.router.navigateByUrl('/project-dashboard');
  }
}
