import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-admin-dashboard-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-invoices.component.html',
  styleUrls: ['./admin-dashboard-invoices.component.scss']
})
export class AdminDashboardInvoicesComponent {

 dateFormat: string = localStorage.getItem('Date_Format');
  getAllexpense: any
  getALLInvoice: any;
  
constructor(private commonservice: CommonService, private sweetlalert: SweetalertService, private router: Router) {
}
ngOnInit(): void {
 this.getAllInvoice()

}

getAllInvoice() {
  this.commonservice.get(`AdminDashboard/Invoice`).subscribe((x) => {
    this.getALLInvoice = x.value
  })
}

navis() {
  this.router.navigate(['invoice-details'])
}

convertPriority(value) {
  const status = ['paid', 'unpaid'];
  let list = status.filter((item, index) => index == value);
  return list;
}



}
