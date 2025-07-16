import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent {

  public addressForm: FormGroup;

  @Input() public set companyId(id: string) {
    this._companyId = id;
    if (id) {
    }
  }
  public get companyId(): string {
    return this._companyId;
  }
  private _companyId!: string;

  @Input() public set getDataById(data: any) {
    this._getDataById = data;
    if (this._companyId) {
      this.addressForm.patchValue(this._getDataById?.companyAddress)
    }
  }
  public get getDataById() {
    return this._getDataById;
  }
  private _getDataById: any;

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
    // this.getAddressById();
  }

  getAddressById() {
    if (this.companyId) {
      this._commonService.get(`CompanyPerson/${this.companyId}`).subscribe(res => {
        this.addressForm.patchValue(res)
      })
    }
  }
  submit() {
    if (!this.addressForm.dirty) {
      return;
    }
    let payload = {
      personId: this._companyId,
      ...this.addressForm.value
    }
    this._commonService.put('CompanyPerson/UpdateAddress', payload).subscribe(res => {
      if (res) {
        this.onList();
        this._commonService.showToast('Address has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  onList() {
    this.router.navigate(['company-list']);
  }
}
