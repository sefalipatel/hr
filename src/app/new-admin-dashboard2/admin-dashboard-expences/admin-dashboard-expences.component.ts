import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
interface Expense {
  id: string;
  expenseBy: string;
  expenseDate: string;
  amount: number;
  paidBy: string | null;
  status: number;
}

@Component({
  selector: 'app-admin-dashboard-expences',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-expences.component.html',
  styleUrls: ['./admin-dashboard-expences.component.scss']
})
export class AdminDashboardExpencesComponent {
  dateFormat: string = localStorage.getItem('Date_Format');
  getAllexpense: Expense[] = [];
  getAlljobInquiry: any;
  
constructor(private commonservice: CommonService, private sweetlalert: SweetalertService, private router: Router) {
}
ngOnInit(): void {
 this.getAllExpense()
 this.getAllJobInquiry()
}


getAllExpense() {
  this.commonservice.get(`AdminDashboard/Expense`).subscribe((x) => {
    this.getAllexpense = x.value
  })


}

nav() {
  this.router.navigate(['expense-details'])
}
navi() {
  this.router.navigate(['jobinquiry'])
}
convertPriority(value) {
  const status = ['paid', 'unpaid'];
  let list = status.filter((item, index) => index == value);
  return list;
}

getAllJobInquiry() {
  this.commonservice.get(`AdminDashboard/JobInquiry`).subscribe((x) => {
    this.getAlljobInquiry = x.value
  })
}

}
