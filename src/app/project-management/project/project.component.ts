import { CommonModule, formatDate } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule, FormsModule, SharedModule, MatSortModule, MatMenuModule, MatIconModule]
})

export class ProjectComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  projectData: any = [];
  constructor(private router: Router,
    private apiService: ApiService,
    private api: CommonService,
    private sweetlalert: SweetalertService) {

  }

  public searchDataValue: string = '';
  loading: boolean = false
  public tableData: Array<Project> = [];
  public userRole: Array<userRole> = [];
  dataSource = new MatTableDataSource<Project>();
  displayedColumns: string[] = ['projectName', 'technologySpecification', 'startDate', 'endDate', 'status', 'priority', 'actions'];
  managerDate: any = [];
  public sortConfig!: Sort;
  dateFormat:string = localStorage.getItem('Date_Format');


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  async ngOnInit() {
   
    this.managerDate = await this.apiService.getPerson();

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Projects";
      })
    }

    this.projectByUser();
  }
 async projectByUser() {
    if (this.userRole[0]?.canEdit) {
      this.tableData = await this.apiService.getProjectDetails();
      this.dataSource.data = this.tableData;
    } else {
      this.getAllUserproject();
    }
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
      this.dataSource.data = res
    })
  }
  ProjectTask(element) {
    this.router.navigate(['project-dashboard/project-task/' + element.id])

  }
  ProjectBoard(element) {
    this.router.navigate(['project-dashboard/project-taskboard/' + element.id])
  }
  exportJson(): void {
    const filteredData = this.dataSource.data.map(row => {
      const filteredRow = {};
      this.displayedColumns?.forEach(column => {
        if (row.hasOwnProperty(column)) {
          filteredRow[column] = row[column];
          filteredRow['status'] = this.convertStatus(row?.status)[0];
          filteredRow['priority'] = this.convertPriority(row?.priority)[0];
        }
      });
      return filteredRow;
    });
    this.api.exportAsExcelFile(filteredData, 'ProjectList', this.displayedColumns);
  }

  convertStatus(value) {
    const status = ['', 'In Progress', 'Completed', 'On Hold'];
    let list = status.filter((item, index) => index == value);
    return list;
  }

  convertPriority(value) {
    const priority = ['High', 'Medium', 'Low'];
    let list = priority.filter((item, index) => index == value);
    return list;
  }

  onBtnClick() {
    this.router.navigate(['/project-dashboard/add-Project']);
  }

  async deleteProject(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`ProjectManagement/${element.id}`).subscribe((res) => {
        if (res.statusCode) {
          this.apiService.showToast('Project deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
          this.searchDataValue = '';
        } else if (res.statusCode != 200) {
          this.apiService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }

      }, (error) => {
        this.api.showToast(error?.error?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }
  }

  editItem(id: string) {
    this.router.navigate(['/project-dashboard/add-Project/' + id]);
    this.searchDataValue = '';
  }

  assignUser(id) {
    this.router.navigate(['project-dashboard/assignUser/' + id]);
  }

  searchData(value) {
    if (value === '') {
      this.dataSource.data = this.tableData;
    } else {
      this.dataSource.data = this.tableData.filter((item) => {
        const searchStatus = this.convertStatus(item.status)[0];
        const searchPriority = this.convertPriority(item.priority)[0];

        return item.id.toLowerCase().includes(value.toLowerCase()) ||
          item.projectName.toLowerCase().includes(value.toLowerCase()) ||
          searchStatus.toLowerCase().includes(value.toLowerCase()) ||
          searchPriority.toLowerCase().includes(value.toLowerCase()) ||
          item.startDate.toLowerCase().includes(value.toLowerCase()) ||
          item.endDate.toLowerCase().includes(value.toLowerCase()) ||
          item.technologySpecification.toLowerCase().includes(value.toLowerCase());
      });
    }
    return;
  }

  convertDate(value) {
    return formatDate(value, "dd-MM-YYYY", 'en-US', '+0530');

  }
  public sortData(sort: Sort) {
    this.sortConfig = sort; 
    return;
  }

    projectSprintTask(id) {
    this.router.navigate([`new-project-page/${id}`]);
  }
}
