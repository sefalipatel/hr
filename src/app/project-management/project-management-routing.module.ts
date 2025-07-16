import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementComponent } from './project-management.component';
import { ProjectaddComponent } from './projectadd/projectadd.component';
import { ProjectComponent } from './project/project.component';
import { AssignuserComponent } from './assignuser/assignuser.component';

const routes: Routes = [
  { path: '' , component: ProjectManagementComponent, redirectTo:'project-details', pathMatch:'full' }, 
  {path :'' ,component:ProjectComponent},
  { path: 'add-Project', component:ProjectaddComponent },
  { path: 'add-Project/:id', component:ProjectaddComponent },
  { path: 'assignUser/:id', component:AssignuserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
