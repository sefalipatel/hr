import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { City, Country, State, ToastType } from 'src/app/service/common/common.model';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
export enum AddressType {
  Present = 0,
  Permanent = 1,
}

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatTableModule, SharedModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export default class AddressComponent {

  AddressTypeenum: { value: number, label: string }[] = [
    { value: 0, label: 'Present' },
    { value: 1, label: 'Permanent' }
  ];
  selectedAddress: number
  country: Array<Country> = [];
  state: Array<State> = [];
  city: Array<City> = [];
  requestId: string
  form: FormGroup
  AddressId: string
  isView?: boolean
  isForm?: boolean = false;

  displayedColumns: string[] = Object.values(MyEnum);
  public userRole: Array<userRole> = [];
  dataSource = new MatTableDataSource<AddressData>();
  public addressDetails:any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID;

      let userPermissions = JSON.parse(localStorage.getItem('userRole'));
      if (userPermissions?.accessPermission?.length) {
        this.userRole = userPermissions?.accessPermission?.filter(item => {
          return item?.module?.module === "UserProfile";
        })
      }
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;

  constructor(private api: CommonService, private route: ActivatedRoute, private formBuilder: FormBuilder, public dialog: MatDialog, private sweetlalert: SweetalertService,) {
    this.form = this.formBuilder.group({
      addressLine1: ['', Validators.required],
      addressLine2: ['', Validators.required],
      addressLine3: ['', Validators.required],
      addressType: ['', Validators.required],
      cityId: ['', Validators.required],
      stateId: ['', Validators.required],
      countryId: ['', Validators.required],
      personId: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.api.get(`Country`).subscribe((res) => {
      this.country = res;
    })
    this.getAddressData();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "UserProfile";
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getStatusLabel(status: number): string {
    const grade = this.AddressTypeenum.find(Address => Address.value === status);
    return grade ? grade.label : 'Unknown';
  }

  Save() {
    this.form.get("personId").setValue(this.requestId);
    this.form.removeControl('id')

    if (this.form.valid) {
      if (this.AddressId) {
        this.form.addControl("id", this.formBuilder.control('', Validators.required));
        this.form.get("id").setValue(this.AddressId)
        this.api.put(`Address`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Address details updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.getAddressData();
            this.isForm = false;
            this.form.reset();
          }
        }, (error) => {
          this.api.showToast('Error updating address details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        })
      } else {
        this.api.post(`Address`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Address details saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.getAddressData();
            this.isForm = false;
            this.form.reset();
          }
        }, (error) => {
          this.api.showToast('Error save address details. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }

  getAddressData() {
    this.api.get(`Person/${this.requestId}/Address`).subscribe((res) => {
      this.addressDetails = res;
      return this.dataSource.data = res
    })
  }

  onCountrySelection(data) {
    this.form.get('stateId').reset()
    this.form.get('cityId').reset()
    this.city = []
    this.api.get(`State/GetStatesByCountryId?countryId=${data.value}`).subscribe((res) => {
      this.state = res;
    })
  }

  onStateSelecetd(data) {
    this.api.get(`City/GetCitiesByStateId?stateId=${data.value}`).subscribe((res) => {
      this.city = res;
    })
  }

  async deleteAddress(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Address/${element.id}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this.getAddressData();
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
          this.api.showToast('Address deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        } else if (res?.statusCode == 400 || !res) {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (error) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data;
    }
  }

  editAddress(element) {
    this.api.get(`Address/${element.id}`).subscribe((res) => {
      this.isForm = true;
      this.form.patchValue(res.value);
      const countryId = res.value.countryId;
      const stateId = res.value.stateId;
      this.api.get(`State/GetStatesByCountryId?countryId=${countryId}`).subscribe((stateRes) => {
        this.state = stateRes;
        this.api.get(`City/GetCitiesByStateId?stateId=${stateId}`).subscribe((cityRes) => {
          this.city = cityRes;
        });
      });
    });
    this.AddressId = element.id;
  }

  addAddress() {
    this.AddressId = null;
    this.isForm = true;
  }

  cancle() {
    this.isForm = false;
    this.form.reset();
  }
  trimNameOnBlur(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
export interface AddressData {
  addressLine1?: string,
  addressLine2?: string,
  addressLine3?: string,
  addressType?: string,
  cityName?: string
  stateName?: string,
  countryName?: string,
  id?: string
}

enum MyEnum {
  addressLine1 = 'addressLine1',
  addressLine2 = 'addressLine2',
  addressLine3 = 'addressLine3',
  addressType = 'addressType',
  cityName = 'cityName',
  stateName = 'stateName',
  countryName = 'countryName',
  Actions = 'actions'
}
