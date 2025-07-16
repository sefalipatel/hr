import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-dashboard-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-client.component.html',
  styleUrls: ['./admin-dashboard-client.component.scss']
})
export class AdminDashboardClientComponent {
  public getUserClient: any;
  public attachmentUrl: string = environment.apiUrl.replace('api/', '')

  constructor(private commonSevice: CommonService, private sweetlalert: SweetalertService, private router: Router,) { }

  ngOnInit(): void {
    this.getAllClient();
  }

  getAllClient() {
    this.commonSevice.get('AdminDashboard/Clients').subscribe(res => {
      this.getUserClient = res?.value;
    })
  }

  edituser(id) {
    this.router.navigate(['/client-list/client/' + id])
  }
  navigate() {
    this.router.navigate(['client-list'])
  }
  async deleteuser(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.commonSevice.delete(`Client/${element}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this.getUserClient.data = this.getUserClient.data.filter((item) => item.id !== element.id);
          this.commonSevice.showToast('Client deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllClient()
        } else if (res?.statusCode == 400 || !res) {
          this.commonSevice.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.commonSevice.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.getUserClient.data
    }
  }

  generateInitials(name: string): string {
    if (!name) return '';
    // Split the name into two parts (like, ["Karan", "Tandel"])
    const nameParts = name.split(' ');
    // Take the first letter from each part and join them (like, "KT")
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
  }

  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
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

}
