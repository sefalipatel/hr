import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss'],
  standalone:true,
  imports: [CommonModule, RouterModule]
})
export class ProjectManagementComponent {

}
