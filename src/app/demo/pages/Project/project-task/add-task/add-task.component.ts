import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule,MatInputModule,ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {

  addTaskForm: FormGroup;


  constructor(  private router: Router, public dialogRef: MatDialogRef<AddTaskComponent>, private fb: FormBuilder, private api:CommonService,
     @Inject(MAT_DIALOG_DATA) public data: {projectID:any }){
    this.addTaskForm = this.fb.group({
      ProjectId: [""],
      Subject: ["", Validators.required],

    });

  }


  cancelPopup() {
    this.dialogRef.close('Cancel');
  }
  createTask(){
    this.addTaskForm.get('ProjectId').setValue(this.data.projectID)
    this.api.post(`Task`,this.addTaskForm.value).subscribe((x)=>{

    })
    
  }
  navigate() {
    this.router.navigateByUrl('/project-dashboard');
  }

}
