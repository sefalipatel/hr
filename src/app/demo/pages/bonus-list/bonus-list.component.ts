import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';

export enum bonusDetailsEnum {
  employeeCode = "employeeCode",
  employeeName = "employeeName"
}
@Component({
  selector: 'app-bonus-list',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './bonus-list.component.html',
  styleUrls: ['./bonus-list.component.scss']
})
export class BonusListComponent implements OnInit {
  public displayedColumns: string[] = [];
  public getUserBonusDetails: any;
  dataSource = new MatTableDataSource<any>();

  @Input() public set bonusUserId(id: string) {
    this._bonusUserId = id;
  }
  public get bonusUserId(): string {
    return this._bonusUserId;
  }
  private _bonusUserId!: string;

  constructor(private commonService: CommonService) {
    this.displayedColumns = Object.values(bonusDetailsEnum);
  }

  ngOnInit(): void { 
  }

  getUserBonus() {
    if (this.bonusUserId) {
      this.commonService.get(`Bonus/${this.bonusUserId}`).subscribe(res => {
        this.getUserBonusDetails = res;
        this.dataSource = new MatTableDataSource<any>(this.getUserBonusDetails);
      })
    }
  }
}
