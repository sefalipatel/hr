import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

export enum calculationType {
  FlatAmount = 1,
  PercentageofCTC = 0,
}
export const calculationTypeLable = {
  [calculationType.FlatAmount]: 'Flat Amount',
  [calculationType.PercentageofCTC]: 'Percentage of CTC',
};
@Component({
  selector: 'app-employee-bonus-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './employee-bonus-list.component.html',
  styleUrls: ['./employee-bonus-list.component.scss']
})
export class EmployeeBonusListComponent implements OnInit {

  public personId: string = '';
  public displayedColumns: string[] = [];
  public getUserBonusDetails: any[] = [];
  dataSource = new MatTableDataSource<any>();

  @Input() public set requestId(requestId: string) {
    this._requestId = requestId;
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isProfile(isProfile: boolean) {
    this.displayedColumns = ['title', 'personCode', 'calculationType', 'amount'];
    this._isProfile = isProfile;
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;

    if (this.personId && !this.requestId) {
      this.getEmployeeBonus(this.personId);
    } else {
      this.getEmployeeBonus(this.requestId);
    }
  }
  public get isProfile(): boolean {
    return this._isProfile;
  }
  private _isProfile: boolean;

  constructor(private route: ActivatedRoute, private _commonService: CommonService) {
  }

  ngOnInit(): void {
  }

  getEmployeeBonus(personId: string) {
    if (personId) {
      this._commonService.get(`Bonus/GetAllBonusByPersonId?personId=${personId}`).subscribe(res => {
        this.getUserBonusDetails = res;
        this.dataSource = new MatTableDataSource<any>(this.getUserBonusDetails);
      })
    }
  }

  getStatusLabel(status: number): string {
    return calculationTypeLable[status] || 'Unknown';
  }
}
