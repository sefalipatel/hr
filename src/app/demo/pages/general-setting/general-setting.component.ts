import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormGroup } from '@angular/forms';
import { OrgContainerComponent } from '../org-container/org-container.component';

interface data {
  value: string;
}
@Component({
  selector: 'app-general-setting',
  standalone: true,
  imports: [CommonModule, SharedModule, OrgContainerComponent],
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export default class GeneralSettingComponent implements OnInit {

  public selectedValue1 = ''
  public selectedValue2 = '';
  public selectedValue3 = '';
  public orgId: string;
  form: FormGroup;

  selectedList1: data[] = [
    { value: 'Choose Time Zone' },
    { value: 'USD Time Zone' },
  ];
  selectedList2: data[] = [
    { value: 'Choose Currency' },
    { value: 'INR' },
    { value: 'USA' },
  ];
  selectedList3: data[] = [
    { value: 'Choose Date Format' },
    { value: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY' },
  ];
  public userRole: any[] = [];

  constructor() {
    this.orgId = localStorage.getItem('orgId') ?? "";
  }

  ngOnInit(): void {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "GeneralSettings";
      })
    }
  }
}
