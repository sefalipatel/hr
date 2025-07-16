import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { AddressComponent } from '../address/address.component';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { SocialProfileComponent } from '../social-profile/social-profile.component';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-form',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, MaterialModule, AddressComponent, BasicInfoComponent, SocialProfileComponent],
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  public companyId: string;
  public companyDataById: any;
  id : string = '';

  constructor(private _commonService: CommonService, private route: ActivatedRoute, private router: Router, private activeRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.route.params.subscribe(async (params) => {
      this.companyId = this.companyId ?? params['id'];
    });
    if (this.companyId) {
      this.getAddressById();
    }
  }

  getAddressById() {
    this._commonService.get(`CompanyPerson/${this.companyId}`).subscribe(res => {
      this.companyDataById = res;
    })
  }

  cancel() {
    this.router.navigate(['company-list']);
  }
}
