import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProjectComponent } from "../../../../project-management/project/project.component";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { userRole } from 'src/app/assets.model';
export interface Project {
  id: string;
  projectName: string;
  projectManager: string;
  startDate: string,
  endDate: string,
  technologySpecification: string,
  status: string;
  priority: string;
}
@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss'],
  imports: [MatCardModule, CommonModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule,
    FormsModule, SharedModule, MatSortModule, MatSelectModule, MatInputModule, ProjectComponent, MatMenuModule, MatIconModule, MatTooltipModule]
})
export class ProjectDashboardComponent {
  public selectedroom: any;
  public selecteperson: any
  public searchDataValue: string = '';
  cardData: any
  projectData: any = [];
  public userRole: Array<userRole> = [];
  loading: boolean = false;
  view: string = 'card';
  dateFormat: string = localStorage.getItem('Date_Format');
  imageUrl: string = environment.apiUrl.replace('api/', '');
  constructor(private router: Router,
    private api: CommonService,
    private sweetlalert: SweetalertService) {
  }

  ngOnInit() {

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Projects";
      })
    }
    this.projectByUser();
  }

  projectByUser() {
    if (this.userRole[0]?.canEdit) {
      this.ProjectManagement();
    } else {
      this.getAllUserproject();
    }
  }

  ProjectManagement() {
    this.loading = true
    this.api.get(`ProjectManagement`).subscribe((res) => {
      this.loading = false
      this.cardData = res
    })
  }

  getAllUserproject() {
    const personId = JSON.parse(localStorage.getItem('userInfo')).personID;
    this.api.get(`ProjectMembers/projectlist?personId=${personId}`).subscribe((res) => {
      res.map(response => {
        let projectLeader;
        response.projectMember.forEach(pm => {
          projectLeader = !projectLeader ? pm : projectLeader?.designationLevel > pm.designationLevel ? pm : projectLeader
        });
        response['projectLeader'] = projectLeader;
        return response;
      })
      this.cardData = res
    })
  }
  convertStatus(value) {
    const status = ['', 'In Progress', 'Completed', 'On Hold'];
    let list = status.filter((item, index) => index == value);
    return list;
  }
  onBtnClick() {
    this.router.navigate(['/project-dashboard/add-Project']);
  }
  onBtnClickList() {
    this.router.navigate(['/project-dashboard']);
  }
  convertPriority(value) {
    const priority = ['High', 'Medium', 'Low'];
    let list = priority.filter((item, index) => index == value);
    return list;
  }
  editProject(id: string) {
    this.router.navigate(['/project-dashboard/add-Project/' + id]);
    this.searchDataValue = '';
  }
  onTreeStructure(id: string) { 
    this.router.navigate(['/sprint/' + id]);
  }
  async deleteProject(card) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`ProjectManagement/${card.id}`).subscribe((res) => {
        this.ProjectManagement()
        if (res.statusCode) {
          this.api.showToast('Project deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.cardData.data = this.cardData.data.filter((item) => item.id !== card.id);
          this.searchDataValue = '';
        } else if (res.statusCode != 200) {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (error) => {
        this.api.showToast(error?.error?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      })
      this.cardData.data
    }
  }
  assignUser(id) {
    this.router.navigate(['/project-dashboard/assignUser/' + id]);
  }
  ProjectTask(element) {
    this.router.navigate(['project-dashboard/project-task/' + element.id])
  }
  ProjectBoard(element) {
    this.router.navigate(['project-dashboard/project-taskboard/' + element.id])
  }
  generateInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase();
  }
  transformImage(image: string): string {
    return image ? this.imageUrl + image.replace('wwwroot\\', '') : '';
  }
  stringToColor(string: any) {
    let hash = 0;
    let i;
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return string?.length ? color : '#bfbfbf';
  }
  projectSprintTask(id) {
    this.router.navigate([`new-project-page/${id}`]);
  }
}
