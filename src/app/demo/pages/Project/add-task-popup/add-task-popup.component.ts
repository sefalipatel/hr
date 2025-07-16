import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task-popup',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule],
  templateUrl: './add-task-popup.component.html',
  styleUrls: ['./add-task-popup.component.scss']
})
export class AddTaskPopupComponent {
  constructor(
    private router: Router,
   
  )
  {
    
  }
  
navigate() {
  this.router.navigateByUrl('/project-dashboard');
}
}
