import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-dashboard-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-employee.component.html',
  styleUrls: ['./admin-dashboard-employee.component.scss']
})
export class AdminDashboardEmployeeComponent {


  getALLEmployeeHR:any
    public attachmentUrl: string = environment.apiUrl.replace('api/', '')
  constructor(private commonservice: CommonService, private sweetlalert: SweetalertService, private router: Router) {
  }
  ngOnInit(): void {
   this.getAllEmployeeHR()
  }


  getAllEmployeeHR() {
    this.commonservice.get(`AdminDashboard/EmployeeHR`).subscribe((x) => {
      this.getALLEmployeeHR = x.value
    })
  }
  getLeavewidth(value, totalValue): number {
    if (!totalValue || isNaN(totalValue)) return 0; // Prevent division by zero
    return Math.round((value / totalValue) * 100);
  }
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
  }
  navigates() {
    this.router.navigate(['project-dashboard'])
  }
  
 
}

