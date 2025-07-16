import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { SweetalertService } from '../role-list/sweetalert.service';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, SharedModule, MaterialModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit{

  public isAddTask: boolean = false;
  public isDecFocus: boolean = false;
  public isSubmitted: boolean = false;
  public isTaskDetailsDisable = false;
  public isCompleted:boolean = false;
  public isImportant:boolean = false;

  public selectedTaskIndex: number = -1;
  public selectCompletedTaskIndex: number = -1;
  selectedTask;

  public comment: string = '';
  public getToDoById: string = '';
  public isSaving: boolean = false; 

  addtitle: FormControl = new FormControl('', [Validators.required,Validators.pattern(/\S/) ]);
  title: FormControl = new FormControl('', [Validators.required]);
  dueDate: FormControl = new FormControl('', [Validators.required]);

  public toDoList: any[] = [];
  public completedToDoList: any[] = [];

  @ViewChild('addInput') addInput: ElementRef;
  @ViewChild('editInput') editInput: ElementRef;
  @ViewChild('editCompletedInput') editCompletedInput: ElementRef;
  
  constructor(private _commonService: CommonService,private datepipe: DatePipe, private sweetlalert: SweetalertService) {

  }

  ngOnInit(): void {
    this.getAllToDoDetails();
  }

  getAllToDoDetails() {
    this._commonService.get(`ToDoList/GetAllToDoListByPersonId`).subscribe((res) => {
      this.toDoList = res.filter(x => {
        return x.isCompleted == false
      })
      this.completedToDoList = res.filter(x => {
        return x.isCompleted == true
      })
    })
  }

  addtask() { 
    if (this.isAddTask) return; // Prevent multiple inputs
    this.isAddTask = true;
    this.isSubmitted = false;
    this.comment = '';
    this.getToDoById = '';
  
    setTimeout(() => {
      if (this.addInput?.nativeElement) {
        this.addInput.nativeElement.focus();
      }
    }, 100);
  }
  
  saveToDo() {
  const trimmedTitle = this.title.value?.trim();
  const trimmedAddTitle = this.addtitle.value?.trim();

  if ((this.getToDoById && (!trimmedTitle || this.title.invalid)) || 
      (!this.getToDoById && (!trimmedAddTitle || this.addtitle.invalid))) {
    this.isSubmitted = true;

    if (this.getToDoById) {
      this.title.setErrors({ required: true });
      this.title.markAsTouched();
      this.title.markAsDirty();
    } else {
      this.title.setErrors({ required: true });
      this.addtitle.markAsTouched();
      this.addtitle.markAsDirty();
    }
    return;
  }
    this.isSaving = true;
    let payload = {
      ...this.selectedTask,
    }

    if (this.getToDoById) {
      let data = {
        ...payload,
        "Title" : trimmedTitle,
        id: this.getToDoById,
      }
      this._commonService.put(`ToDoList`, data).subscribe(res => {
        this._commonService.showToast('To do updated successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
        this.afterSave();
        this.getAllToDoDetails();
        this.title.reset();
        this.addtitle.reset();
        this.selectedTaskIndex = -1;
        this.selectCompletedTaskIndex = -1;
      }, (error) => {
        this._commonService.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR)
        this.isSaving = false;
      })
    }
    else{
      let data = {
        ...payload,
        "Title" : trimmedAddTitle,
      }
      this._commonService.post(`ToDoList`, data).subscribe(res => {
        this._commonService.showToast('To do added successfully.', ToastType.SUCCESS, ToastType.SUCCESS)
        this.getAllToDoDetails();
        this.title.reset();
        this.addtitle.reset();
        this.selectedTaskIndex = -1;
        this.selectCompletedTaskIndex = -1;
      }, (error) => {
        this._commonService.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR)
      })
    }
    this.closeAddToDoForm();
  }
  closeAddToDoForm() {
    this.title.reset();
    this.addtitle.reset();  
    this.title.setErrors(null);
    this.addtitle.setErrors(null);
    this.selectedTaskIndex = -1;
    this.selectCompletedTaskIndex = -1;
    this.isAddTask = false;
    this.isSubmitted = false;
    this.getToDoById = '';
  }

  onCompleteTask(data) {
    this.isCompleted = !this.isCompleted;
    this._commonService.put(`ToDoList/IsCompleted?id=${data.id}&isCompleted=${!data.isCompleted}`,'').subscribe(res => {
      this.getAllToDoDetails();
    })
  }
  onUpdateImportantNote(data) {
    this.isImportant = !this.isImportant;
    this._commonService.put(`ToDoList/IsImportant?id=${data.id}&isImportant=${!data.isImportant}`,'').subscribe(res => {
      this.getAllToDoDetails();
    })
  }
  updateDate(id, date?: any) {
    let dueDate = this.datepipe.transform(date.target.value, 'YYYY-MM-dd')
    this._commonService.put(`ToDoList/DueDate?id=${id}&dueDate=${dueDate}`,'').subscribe(res => {
      this.getAllToDoDetails();
    })
  }
  onToDoEdit(taskIndex: number) {
    this.isTaskDetailsDisable = false
    this.closeAddToDoForm();
    this.getToDoById = this.toDoList[taskIndex]?.id
    this.selectedTaskIndex = taskIndex;
    this.selectedTask = this.toDoList[taskIndex]
    this.title.setValue(this.toDoList[taskIndex]?.title);
    setTimeout(() => {
      this.editInput?.nativeElement.focus();
    }, 100);
  }
  onCompleteToDoEdit(taskIndex: number) {
    this.isTaskDetailsDisable = false;
    this.closeAddToDoForm();
    this.isSubmitted = false; // Reset validation state for all fields
  
    this.getToDoById = this.completedToDoList[taskIndex]?.id;
    this.selectCompletedTaskIndex = taskIndex;
    this.selectedTask = this.completedToDoList[taskIndex];
  
    this.title.setValue(this.completedToDoList[taskIndex]?.title);
  
    // Reset validation state only for the edited field
    this.title.markAsPristine();
    this.title.markAsUntouched();
  
    setTimeout(() => {
      this.editCompletedInput?.nativeElement.focus();
    }, 100);
  }
  
  async deleteToDo(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`ToDoList/${id} `).subscribe((x) => {
        this.isTaskDetailsDisable = false
        this._commonService.showToast(`To do deleted successfully`, ToastType.SUCCESS, ToastType.SUCCESS)
        this.getAllToDoDetails();
      }, (error) => {
        this._commonService.showToast('Something went wrong.', ToastType.ERROR, ToastType.ERROR)
      })
    }

  }

  afterSave() {
    this.getAllToDoDetails();
    this.title.reset();
    this.addtitle.reset();
    this.selectedTaskIndex = -1;
    this.selectCompletedTaskIndex = -1;
    this.isSaving = false; // Unlock submit action after successful save
    this.closeAddToDoForm();
}

 trimNameOnBlur(control: FormControl) {
    if (control && control.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }  
}