import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-tree-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-tree-view.component.html',
  styleUrls: ['./project-tree-view.component.scss']
})
export class ProjectTreeViewComponent {
  employeeTree: any[] = [];
  orgEmployeeList: any[] = [];
  ProjectList: any = {}
    
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  favIcon: string = '';
  public defaultImg: string = 'assets/images/tree-view/5.png';
 
  constructor(
    private _commonService: CommonService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
  }
 
  ngOnInit(): void {
    this.getOrgIcon();
    this.getOrgEmployee();
  }
 
  getOrgIcon() {
    this._commonService.favIcon$.subscribe((newFavicon) => {
      if (newFavicon) {
        this.favIcon = this.imageUrl + newFavicon;
      }
    });

    // Load from localStorage 
    const savedFavicon = localStorage.getItem('favIcon');
    if (savedFavicon) {
      this.favIcon = this.imageUrl + savedFavicon;
    }
  }
  getOrgEmployee() {
    let projectId = this.activeRoute.snapshot.params['id'] ?? '';

    this._commonService.get(`ProjectManagement/GetProjectTree/${projectId}`).subscribe(res => {
      this.ProjectList = res.value[0];
    })
      
  }

  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
  onList() {
    this.router.navigate(['project-dashboard']);
  }

}
