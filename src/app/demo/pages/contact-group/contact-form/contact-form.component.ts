import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactAddressComponent } from '../contact-address/contact-address.component';
import { BasicInfoComponent } from '../basic-info/basic-info.component';
import { ContactSocialProfileComponent } from '../contact-social-profile/contact-social-profile.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-contact-form',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SharedModule, MatTabsModule, ContactAddressComponent, BasicInfoComponent, ContactSocialProfileComponent, RouterModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  public contactId: string;
  public contactDataById: any;
  id: string = '';

  constructor(private route: ActivatedRoute,  private activeRoute: ActivatedRoute, private _commonService: CommonService,private router:Router) { }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.route.params.subscribe(async (params) => {
      this.contactId = this.contactId ?? params['id'];
    })
    if (this.contactId) {
      this.getByContactId();
    }
  }
  getByContactId() {
    this._commonService.get(`Contact/GetContactInfoByPersonId?contactpersonId=${this.contactId}`).subscribe(res => {
      this.contactDataById = res;
    })
  }
}
