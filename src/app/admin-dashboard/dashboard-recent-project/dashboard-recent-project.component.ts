import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { ToastType } from 'src/app/service/common/common.model';
@Component({
  selector: 'app-dashboard-recent-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-recent-project.component.html',
  styleUrls: ['./dashboard-recent-project.component.scss']
})
export class DashboardRecentProjectComponent {
  getALLInvoice: any
  dateFormat: string = localStorage.getItem('Date_Format');
  getALLProjects: any;
  constructor(private router: Router,private commonservice: CommonService, private sweetlalert: SweetalertService) {

  }
  ngOnInit() {
    this.getAllInvoice()
    this.getAllProjects()
  }
  getAllInvoice() {
    this.commonservice.get(`AdminDashboard/Invoice`).subscribe((x) => {
      this.getALLInvoice = x.value
    })
  }
  getAllProjects() {
    this.commonservice.get(`AdminDashboard/Projects`).subscribe((x) => {
      this.getALLProjects = x.value
    })
  }
  editProject(id: string) {
    this.router.navigate(['/project-dashboard/add-Project/' + id]);
    this.getALLProjects = '';
  }
  async deleteProject(card) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.commonservice.delete(`ProjectManagement/${card.id}`).subscribe((res) => {
        this.getAllProjects()
        if (res.statusCode) {
          this.commonservice.showToast('Project deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getALLProjects.data = this.getALLProjects.data.filter((item) => item.id !== card.id);
          this.getALLProjects = '';

        } else if (res.statusCode != 200) {
          this.commonservice.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (error) => {
        this.commonservice.showToast(error?.error?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      })
      this.getALLProjects.data
    }
  }
  convertPriority(value) {
    const status = ['paid', 'unpaid', 'partialy'];
    let list = status.filter((item, index) => index == value);
    return list;
  }
  getLeavewidth(value,totalValue):number{
    return Math.round(((+value ?? 0) / (+totalValue ?? 0))*100)
  }
  navigate(){
    this.router.navigate(['project-dashboard'])
  }
  navi(){
    this.router.navigate(['invoice-details'])
  }
}
