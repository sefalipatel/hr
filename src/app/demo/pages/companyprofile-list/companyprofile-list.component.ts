import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { LoaderComponent } from "../../../loader/loader.component";
@Component({
  selector: 'app-companyprofile-list',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './companyprofile-list.component.html',
  styleUrls: ['./companyprofile-list.component.scss']
})
export class CompanyprofileListComponent {
  companyprofile: any;
  organizationId: any;
  loading : boolean =false
  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,

  ) {

  }
  ngOnInit(): void {
    this.getcomapnyprofile();
  }
  getcomapnyprofile() {
    this.loading = true
    this.apiService.getcompanyprofile().then((data) => {
      this.loading = false
      this.companyprofile = data;
    });
  }
}
