import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastType } from '../../models/models';
import { CommonService } from 'src/app/service/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { userRole } from 'src/app/assets.model';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatTableModule, MatPaginatorModule, SharedModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent {
  financeForm: FormGroup;
  requestId: string;
  requestEmpId: string;
  isView?: boolean;
  isForm?: boolean = false;
  public isSubmitted: boolean;
  public isProfileView: boolean = true;
  BnakDetailsId: string;
  isSubmitting : boolean = false

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<PeriodicElement>();
  public userRole: Array<userRole> = [];
  displayedColumns: string[] = Object.values(FinanceEnum);
  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      this.requestId = JSON.parse(localStorage.getItem('userInfo')).personID
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;

  @Output() isAddBankEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(private api: CommonService, private _fb: FormBuilder, public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private sweetlalert: SweetalertService,) {
    this.financeForm = this.buildForm();
  }

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.requestId = this.requestId ?? params['id'];
    });
    this.getBankDetils();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));

    let role = localStorage.getItem('roleName');
    this.displayedColumns = role === "Admin" ? Object.values(FinanceEnum) : Object.values(FinanceEnum).filter(column => column != 'actions');

    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "UserProfile";
      })
    }
  }

  receiveEmployeeId($event: any) {
    this.requestEmpId = $event;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  buildForm() {
    return this._fb.group({
      accountName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.maxLength(50)]],
      accountNumber: ['', [Validators.required,  Validators.pattern("^[0-9]*$"), Validators.maxLength(20)]],
      bankName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.maxLength(50)]],
      bankBranch: ['', [Validators.required, Validators.maxLength(50)]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),Validators.maxLength(15)]],
      personId: ['', [Validators.required]]
    })
  }

  get financeFormControl() {
    return this.financeForm.controls;
  }

  Save() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.financeForm.invalid) {
      this.financeForm.markAllAsTouched();
      this.isSubmitted = true;
    }

    this.financeForm.get("personId").setValue(this.requestId);
    this.financeForm.removeControl('id');

    if (this.financeForm.valid) {
      if (this.BnakDetailsId) {
        this.financeForm.addControl("id", this._fb.control('', Validators.required));
        this.financeForm.get("id").setValue(this.BnakDetailsId)
        this.api.put(`BankDetail`, this.financeForm.value).subscribe((res) => {

          if (res) {
            this.api.showToast('BankDetail updated sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.getBankDetils();
            this.isForm = false;
            this.isAddBankEvent.emit(false);
            this.financeForm.reset()
          }
        },
          (error) => {
            this.api.showToast('Error updating bankDetail. Please try again later.', ToastType.ERROR, ToastType.ERROR);
          }
        )
      } else {
        this.api.post(`BankDetail`, this.financeForm.value).subscribe((res) => {
          if (res) {
            this.api.showToast('BankDetail saved sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.getBankDetils();
            this.isForm = false;
            this.isAddBankEvent.emit(false);
            this.financeForm.reset()
          }
        }, (error) => {
          this.api.showToast('Error save bankDetail. Please try again later.', ToastType.ERROR, ToastType.ERROR);
        })
      }
    } else {
      this.financeForm.markAllAsTouched()
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
        this.api.showToast('BankDetail deleted sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }
  }

  addBankDetail() {
    this.isForm = true;
    this.BnakDetailsId = null;
    this.isAddBankEvent.emit(true);
  }

  editBankDetilas(element) {
    this.api.get(`BankDetail/${element.id}`).subscribe((res) => {
      this.isForm = true;
      this.financeForm.setValue(res.value)
    })
    this.BnakDetailsId = element.id;
    this.isAddBankEvent.emit(true);
  }

  cancle() {
    this.isForm = false;
    this.isAddBankEvent.emit(false);
    this.financeForm.reset();
  }
  trimNameOnBlur(controlName: string) {
    const control = this.financeForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
export interface PeriodicElement {
  accountName: string,
  accountNumber: string,
  bankName: string,
  bankBranch: string,
  ifscCode: string
  id: string
}
enum FinanceEnum {
  accountName = 'accountName',
  accountNumber = 'accountNumber',
  bankName = 'bankName',
  bankBranch = 'bankBranch',
  ifscCode = 'ifscCode',
  actions = 'actions'
}
