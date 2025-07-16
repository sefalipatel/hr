import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-dashboard-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-projects.component.html',
  styleUrls: ['./admin-dashboard-projects.component.scss']
})
export class AdminDashboardProjectsComponent {
  getALLProjects:any
    public attachmentUrl: string = environment.apiUrl.replace('api/', '')
  constructor(private commonservice: CommonService, private sweetlalert: SweetalertService, private router: Router) {
  }
  ngOnInit(): void {
   this.getAllProjects()
  }


  getAllProjects() {
    this.commonservice.get(`AdminDashboard/Projects`).subscribe((x) => {
      this.getALLProjects = x.value
    })
  }
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }
  navigates() {
    this.router.navigate(['project-dashboard'])
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
  
  generateInitials(name: string): string {
    if (!name) return '';
    // Split the name into two parts (like, ["Karan", "Tandel"])
    const nameParts = name.split(' ');
    // Take the first letter from each part and join them (like, "KT")
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
  }
}
