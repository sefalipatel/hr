import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastType } from 'src/app/service/common/common.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';
@Component({
  selector: 'app-bank-details',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatTableModule, SharedModule, MatDatepickerModule, MatRadioModule],
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export default class BankDetailsComponent implements OnInit {
  isView?: boolean
  requestId: string
  form: FormGroup
  BnakDetailsId: string
  public isSubmitted: boolean;
  public userRole: Array<userRole> = [];
  displayedColumns: string[] = Object.values(MyEnum);
  dataSource = new MatTableDataSource<BankData>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private api: CommonService, private route: ActivatedRoute, private formBuilder: FormBuilder, public dialog: MatDialog, private sweetlalert: SweetalertService,) {
    this.form = this.buildForm();
  }

  ngOnInit() {
    this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID

    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.getBankDetils();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "employee-details";
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  buildForm() {
    return this.formBuilder.group({
      accountName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      accountNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      bankName: ['', Validators.required],
      bankBranch: ['', Validators.required],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      personId: ['', Validators.required]
    })
  }

  // form control
  get bankFormControl() {
    return this.form.controls;
  } 

  Save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.isSubmitted = true;
    }

    this.form.get("personId").setValue(this.requestId)
    if (this.form.valid) {
      if (this.BnakDetailsId) {
        this.form.addControl("id", this.formBuilder.control('', Validators.required));
        this.form.get("id").setValue(this.BnakDetailsId)
        this.api.put(`BankDetail`, this.form.value).subscribe((res) => {

          if (res) {
            this.api.showToast('BankDetail updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.getBankDetils()
            this.form.reset()
          }
        },
          (error) => {
            this.api.showToast('Error updating bankDetail. Please try again later.', ToastType.ERROR, ToastType.ERROR);
          }
        )
      } else {
        this.api.post(`BankDetail`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('BankDetail saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.getBankDetils()
            this.form.reset()
          }
        }, (error) => {
          this.api.showToast('Error while saving bankDetail. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }

  getBankDetils() {
    this.api.get(`Person/${this.requestId}/bankDetail`).subscribe((res) => {
      return this.dataSource.data = res
    })
  }

  async deleteBankDetails(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`BankDetail/${element.id}`).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.api.showToast('BankDetail deleted Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }
  }

  editBankDetilas(element) {
    this.api.get(`BankDetail/${element.id}`).subscribe((res) => {
      this.form.setValue(res.value)
    })
    this.BnakDetailsId = element.id
  }

  cancle() {
    this.form.reset();
  }

}
export interface BankData {
  accountName?: string,
  accountNumber?: string,
  bankBranch?: string,
  bankName?: string
  ifscCode?: string,
  id?: string
}

enum MyEnum {
  accountName = 'accountName',
  accountNumber = 'accountNumber',
  bankBranch = 'bankBranch',
  bankName = 'bankName',
  ifscCode = 'ifscCode',
  Actions = 'actions'
}
