import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SweetalertService } from '../../role-list/sweetalert.service';
export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum Status {
  Available = 0,
  Assigned = 1,
  InProgress = 2,
  InReview = 3,
  ReOpen = 4,
  Completed = 5
}
@Component({
  selector: 'app-project-task',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SharedModule, DatePipe, MatButtonModule, MatExpansionModule, MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatMomentDateModule],
  templateUrl: './project-task.component.html',
  styleUrls: ['./project-task.component.scss']
})
export class ProjectTaskComponent {
  projectAllData: any;
  form: FormGroup
  task: FormControl = new FormControl('', [Validators.required]);
  description: FormControl = new FormControl('', [Validators.required]);
  assignDueDate: FormControl = new FormControl('', [Validators.required]);
  public getProjecttaskData: any[];
  selectedTaskIndex: number = -1;
  projectWiseTask: any = [];
  isSubmitting : boolean = false
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
  projectId: any;
  getAllTaskData: any = null;
  isAddTask: boolean = false;
  isDecFocus: boolean = false;
  isSubmitted: boolean = false;
  attachmentURL: string = environment.apiUrl.replace('api/', '')
  dateFormat: string = localStorage.getItem('Date_Format');
  timeFormat: string = localStorage.getItem('Time_Format');

  @ViewChild('addInput') addInput: ElementRef;
  @ViewChild('editInput') editInput: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('fileInput') fileInput: ElementRef;
  selectedFiles: File[] = [];
  getTaskById: any;
  id: any;
  isTaskSetailsDisable = false
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
  comment: string = '';
  isTimeLine = false;
  @ViewChild('search') search: ElementRef;

  constructor(private api: CommonService, private activeRoute: ActivatedRoute, public dialog: MatDialog, private fb: FormBuilder, private datepipe: DatePipe, private router: Router, private elementRef: ElementRef, private sweetlalert: SweetalertService) {
    this.form = this.fb.group({
      Comment: ''
    })
  }
  ngOnInit() {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.projectId = this.activeRoute.snapshot.params['id'] ?? '';
    let task: any = this.activeRoute.snapshot.queryParams ?? null;
    if (task?.id) {
      this.getByIdtaskWiseDetails(task);
    }

    this.projectTaskDetails()
    this.AssignUserByProject()

  }

  onCommentChange() {
    this.saveTask()
  }
  projectTaskDetails() {
    this.api.get(`Task/project/${this.projectId}`).subscribe((x) => {
      this.projectWiseTask = x;
      this.getProjecttaskData = x;
      this.projectName = x?.length ? x[0].projectName : null
    })
  }
  getByIdtaskWiseDetails(projectTasklist) {
    this.getAllTaskData = null;
    this.api.get(`Task/${projectTasklist.id}`).subscribe((x) => {
      this.getAllTaskData = x?.length ? x[0] : null;
      this.task.setValue(this.getAllTaskData.subject);
      this.comment = this.getAllTaskData?.description;
      this.getTaskById = projectTasklist.id
      this.getAllconversation()
      this.getAllFollewers()
      this.getTimeline()
    })
    this.isTaskSetailsDisable = true
  }
  addtask() {
    this.closeAddTaskForm();
    this.isAddTask = true;
    this.getTaskById = '';
    this.comment = '';
    setTimeout(() => {
      this.addInput.nativeElement.focus();
    }, 100);
  }
  trimNameOnBlur() {
    if (this.task.value) {
      const trimmedValue = this.task.value.trim();
      this.task.setValue(trimmedValue || '', { emitEvent: false });
    }
  }
  saveTask() {
    if (this.task.value) {
      const trimmedValue = this.task.value.trim();
      this.task.setValue(trimmedValue || '', { emitEvent: false });
  
      if (!trimmedValue) {
        return;
      }
    }
  
    if (this.task.invalid && !this.isDecFocus) {
      this.isSubmitted = true
      return;
    }
    if (this.getTaskById) {
      const payload = {
        id: this.getTaskById,
        ProjectId: this.projectId,
        Subject: this.task?.value,
        Description: this.comment ? this.comment : ''
      }
      // this.projectWiseTask[this.selectedTaskIndex].Subject = this.task.value;
      this.api.put(`Task`, payload).subscribe({
        next: (x) => {
          this.isDecFocus = false;
          this.api.showToast('Task Updated Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
          const projectTasklist = { id: this.getTaskById };
          this.getByIdtaskWiseDetails(projectTasklist);
          this.selectedTaskIndex = -1;
        },
        error: (error) => {
          const errorMsg = error?.error?.message || 'Something went wrong.';
          this.api.showToast(errorMsg, ToastType.ERROR, ToastType.ERROR);
        }
      });
      
      } else {
        let payload: any = {
          ProjectId: this.projectId,
          Subject: this.task?.value,
          
        };
        payload = this.comment ? { ...payload, Description: this.comment } : payload;
      
        this.api.post(`Task`, payload).subscribe({
          next: (x) => {
            this.api.showToast('Task added successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
            this.projectTaskDetails();
            this.selectedTaskIndex = -1;
          },
          error: (error) => {
            const errorMsg = error?.error?.message || 'Something went wrong.';
            this.api.showToast(errorMsg, ToastType.ERROR, ToastType.ERROR);
          }
        });
      }    
    this.closeAddTaskForm();
  }

  onTaskEdit(taskIndex: number) {
    this.isTaskSetailsDisable = false 
    this.closeAddTaskForm();
    this.getTaskById = this.projectWiseTask[taskIndex]?.id
    this.selectedTaskIndex = taskIndex;
    this.task.setValue(this.projectWiseTask[taskIndex].subject);
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    }, 100);
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
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (!this.selectedFiles.length && !this.form.get('Comment').value) {
      return;
    }
    const formData = new FormData();
    formData.append('Comment', this.form.get('Comment').value)
    formData.append('TaskId', this.getTaskById)
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('File', this.selectedFiles[i]);
    }

    this.api.post(`Task/conversion`, formData).subscribe((x) => {
      if (x.statusCode == 200) {
        this.isSubmitting = false
        this.getAllconversation()
        this.form.reset()
        this.selectedFiles = []
      }
    }, (error) => {
      this.api.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })
  }
  resetFormData() {
    this.form.reset();
    this.selectedFiles = [];
  }
  getAllconversation() { 
    this.api.get(`Task/conversion/${this.getTaskById}`).subscribe((x) => {
      if (x.statusCode == 200) {
        this.taskConversion = x.value
      }
    })
  }

  AssignUserByProject() {
    this.api.get(`ProjectManagement/project/${this.projectId}`).subscribe((x) => {
      this.AssignUserByProjects = x.value.projectMembers.map((x) => x)
    })
  } 
  onAssignSelected(Asssignid?: any) {
    this.api.put(`Task/assign?taskId=${this.getTaskById}&assignedId=${Asssignid?.personId} `, {}).subscribe((x) => {
      const projectTasklist = {
        id: this.getTaskById
      }
      this.getByIdtaskWiseDetails(projectTasklist)
      this.api.showToast(x?.value, ToastType.SUCCESS, ToastType.SUCCESS)

    }, (error) => {
      this.api.showToast('Something went wrong ', ToastType.ERROR, ToastType.ERROR)
    })

  }
  async deleteTask(projectTasklist) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Task/${projectTasklist.id} `).subscribe((x) => {
        this.isTaskSetailsDisable = false
        this.api.showToast("Task deleted Successfully", ToastType.SUCCESS, ToastType.SUCCESS)
        this.projectTaskDetails()
      }, (error) => {
        this.api.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR)
      })
    }

  }

  updateDueDate(data) {
    this.dueDateFormate = this.datepipe.transform(data._d, 'YYYY/MM/dd')

    this.api.put(`Task/dueDate?taskId=${this.getTaskById}&dueDate=${this.dueDateFormate} `, {}).subscribe((x) => {
      this.api.showToast('Task due date updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      const projectTasklist = {
        id: this.getTaskById
      }
      this.getByIdtaskWiseDetails(projectTasklist)

    }, (error) => {
      this.api.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })
  }
  closedsidemanu() {
    this.isTaskSetailsDisable = false
  }

  navigate() {
    this.router.navigateByUrl('/project-dashboard');
  }
  getAllFollewers() {
    this.api.get(`Task/followers/${this.getTaskById} `).subscribe((x) => {
      this.uploadedlogo = []
      x.value.map((img) => {
        let logo = img
        let uploadedlogo = logo;
        this.uploadedlogo.push(uploadedlogo)
      })
    })
  }
  follower(folowerData?: any) {
    const payload = {
      TaskId: this.getTaskById,

      EmployeeId: folowerData?.person?.id
    }
    this.api.post(`Task/followers`, payload).subscribe((x) => {
      if (x.statusCode == 200) {
        this.api.showToast('Follower added successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
        this.getAllFollewers()
      } else {
        this.api.showToast(x?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }

    })

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
          }
          this.getByIdtaskWiseDetails(projectTasklist)
          this.projectTaskDetails()
        })
      }
    }
    else if (alldata?.status === 2) {
      if (alldata?.createdBy == alldata?.assignedId && alldata?.createdBy == this.personId && alldata.assignedId == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${5}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          }
          this.getByIdtaskWiseDetails(projectTasklist)
          this.projectTaskDetails()
        })

      }
      else if (alldata?.status === 2) {
        if (alldata?.assignedId == this.personId) {
          this.api.put(`Task/status?taskId=${this.getTaskById}&status=${3}`, {}).subscribe((x) => {
            const projectTasklist = {
              id: this.getTaskById
            }
            this.getByIdtaskWiseDetails(projectTasklist)
            this.projectTaskDetails()
          })
        }
      }
    }

    else if (alldata?.status === 3) {
      if (alldata?.createdBy == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${5}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          }
          this.getByIdtaskWiseDetails(projectTasklist)
          this.projectTaskDetails()
        })
      }
    }
    else if (alldata?.status === 5) {
      this.api.put(`Task/status?taskId=${this.getTaskById}&status=${2}`, {}).subscribe((x) => {
        const projectTasklist = {
          id: this.getTaskById
        }
        this.getByIdtaskWiseDetails(projectTasklist)
        this.projectTaskDetails()
      })
    }

  }

  cahngeRejectedStatus(alldata) {

    if (alldata?.status === 3) {
      if (alldata?.createdBy == this.personId) {
        this.api.put(`Task/status?taskId=${this.getTaskById}&status=${2}`, {}).subscribe((x) => {
          const projectTasklist = {
            id: this.getTaskById
          }
          this.getByIdtaskWiseDetails(projectTasklist)
          this.projectTaskDetails()

        })
      }
    }

  }
  getTimeline() {
    this.api.get(`Task/timeline/${this.getTaskById}`).subscribe((x) => {
      this.timeLineData = x
    })
  }
  onTimeLineChange() {
    this.isTimeLine = !this.isTimeLine;
  }
  updatePriority(taskId?: string, priority?: number) {
    this.api.put(`Task/priority?taskId=${taskId}&priority=${priority}`, {}).subscribe(res => {
      const projectTasklist = {
        id: this.getTaskById
      }
      this.getByIdtaskWiseDetails(projectTasklist);
    })
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
          }
          else if (status.assignedId == this.personId) {

            return 'Closed';

          } else {
            return 'In-Progress'
          }
        case Status.InReview:
          if (status.assignedId == this.personId) {

            return 'In-Review';

          } else if (status.createdBy == this.personId) {
            return 'Accept'
          }
          else {
            return 'In-Review'
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
    if (selectedStatus === "0" || selectedStatus === "5") {
      this.projectWiseTask = this.getProjecttaskData.filter(item => item.status == selectedStatus)
    } else {
      this.projectWiseTask = this.getProjecttaskData;
    }
  }

}
