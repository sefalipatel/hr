import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
import { City, Country, State, ToastType } from 'src/app/service/common/common.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-address',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './contact-address.component.html',
  styleUrls: ['./contact-address.component.scss']
})
export class ContactAddressComponent implements OnInit {
  public addressForm: FormGroup;
  @Input() contactId: string;
  @Input() public set getContactDataById(data) {
    this._getContactDataById = data;
    if (this.contactId) {
      this.addressForm.patchValue(this._getContactDataById?.contactAddress)
    }
  }
  public get getContactDataById(): any {
    return this._getContactDataById;
  }
  private _getContactDataById: any;

  constructor(private _commonService: CommonService, private _fb: FormBuilder, private router: Router) {
    this.addressForm = this._fb.group({
      city: [''],
      state: [''],
      country: [''],
      address: [''],
      zipCode: ['']
    })
  }

  ngOnInit() {
  }

  submit() {
    if (!this.addressForm.dirty) {
      return;
    }
    let payload = {
      contactPersonId: this.contactId,
      ...this.addressForm.value
    }
    this._commonService.put('Contact/UpdateContactAddress', payload).subscribe(res => {
      if (res) {
        this._commonService.showToast('Address updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.onList();
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  onList() {
    this.router.navigate(['contact/information']);
  }
}
