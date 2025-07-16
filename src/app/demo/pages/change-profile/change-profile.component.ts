import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import AddEmployeeComponent from '../Employee/add-employee/add-employee.component';
import { ProDetailComponent } from 'src/app/profile/pro-detail/pro-detail.component';

@Component({
  selector: 'app-change-profile',
  standalone: true,
  imports: [CommonModule, AddEmployeeComponent, ProDetailComponent],
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.scss']
})
export class ChangeProfileComponent implements OnInit, OnDestroy{

  personId: string;
  isProfile: boolean;

  constructor() {
    this.isProfile = true;
  }
  
  ngOnInit(): void {
  }
  
  receivedId($event) {
    this.personId = $event;
  }
  ngOnDestroy(): void {
    this.isProfile = false;
  }

}
