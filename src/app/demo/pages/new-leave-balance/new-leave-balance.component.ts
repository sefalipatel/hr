import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-leave-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-leave-balance.component.html',
  styleUrls: ['./new-leave-balance.component.scss']
})
export class NewLeaveBalanceComponent implements OnInit {

  public personId: string = '';
  imageUrl: string = environment.apiUrl.replace('api/', '');
  public leaveTypeCardList: any[] = [];

  constructor(
    private _commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.getAllCardLeaveType()
  }

  getAllCardLeaveType() {
    this._commonService.get(`EmployeeLeave/PersonLeave?personId=${this.personId}`).subscribe((res: any) => {
      if (res) {
        this.leaveTypeCardList = res || [];
      }
    });
  }

  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
}
