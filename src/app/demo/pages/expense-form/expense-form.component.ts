import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { userRole } from 'src/app/assets.model';

enum ExpenseStatus {
  Paid = 1,
  UnPaid = 0,
}

const ExpenseStatusLabels = {
  [ExpenseStatus.Paid]: 1,
  [ExpenseStatus.UnPaid]: 0,
};

@Component({
  selector: 'app-expense-form',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule, MaterialModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {

  public expenseForm: FormGroup;
  public expenseId: string;
  public expenseDetail: any;
  uploadedlogo: string;
  public imageFileOnly: string;
  imageUrl: string = environment.apiUrl.replace('api/', '')
  public expenseTypeList: Array<any>;
  isSubmmitted: boolean = false;
  public roleName:string;
  maxDate: Date;
  id: string = '';
  public userRole: Array<userRole> = [];
  @ViewChild('logoUploader') logoUploader!: ElementRef;

  expenseStatusOptions = [
    { value: ExpenseStatus.Paid, status: 'Paid' },
    { value: ExpenseStatus.UnPaid, status: 'Unpaid' }
  ];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private activeRoute: ActivatedRoute, private router: Router, private _commonService: CommonService, private datePipe: DatePipe) {
    this.expenseForm = this.buildForm();
    this.imageFileOnly = this._commonService.imageFileOnly;
    this.isSubmmitted = false;
    this.maxDate = new Date();
  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getFormValue();
    this.getExpensTypeData();
    let role =  JSON.parse(localStorage.getItem('userRole')).personRole;   
    this.roleName = role;

    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Expense";
      })
    }

    if(!this.userRole[0].canEdit) {
      this.expenseForm.controls['status'].disable();
    }

  }

  buildForm() {
    return this.formBuilder.group({
      expenseDate: ["", [Validators.required]],
      amount: ["", [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]],
      typeId: ["", [Validators.required]],
      file: [""],
      status: [ExpenseStatus.UnPaid, [Validators.required]],
      description: ["",[Validators.maxLength(200)]],
      expenseBy:[JSON.parse(localStorage.getItem('userInfo')).personID]
    })
  }

  get expenseFormControl() {
    return this.expenseForm.controls;
  }

  getExpensTypeData() {
    this._commonService.get('ExpenseType').subscribe(res => {
      this.expenseTypeList = res;
    })
  }

  getFormValue() {
    this.route.params.subscribe(async (params) => {
      this.expenseId = params['id'];
    });
    if (this.expenseId) {
     
      this._commonService.get(`Expense/${this.expenseId}`).subscribe(res => {
        this.expenseForm.patchValue(res?.value);
        this.expenseDetail = res?.value;
        let logo = res?.value?.bill && res?.value?.bill?.includes('.') ? `${environment.apiUrl.replace('api/', '')}` + res?.value?.bill : '';
        this.uploadedlogo = logo;
        this.expenseForm.patchValue({
          status: res?.value?.status
        });

      })
    } else { 
    }
  }

  public onLogoSelect(logo: any) {
    const file = logo?.target.files;
    if (file && file[0] && file[0]?.type?.includes("image/")) {
      const file = logo.target.files[0];
      this.expenseForm.controls['bill']?.setValue(file);
      this.expenseForm.controls['file']?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          this.uploadedlogo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    } else {
      this._commonService.showToast('Upload Image file only', ToastType.ERROR, ToastType.ERROR)
    }
  }

  resetLogoUploader() {
    this.logoUploader.nativeElement.value = null;
    this.expenseForm.controls['imageLogo']?.reset();
    let logo = this.expenseDetail?.bill && this.expenseDetail?.bill?.includes('.') ? `${environment.apiUrl.replace('api/', '')}` + this.expenseDetail?.bill : '';
    this.uploadedlogo = logo ?? '';
  }

  addExpenseType() {
    if (this.expenseForm.invalid) {
      this.isSubmmitted = true;
      this.expenseForm.markAllAsTouched();
      return;
    }

    const formattedDate = this.datePipe.transform(this.expenseForm.value.expenseDate, 'yyyy-MM-ddTHH:mm:ss');
    this.expenseForm.patchValue({ expenseDate: formattedDate });
    let keys = Object.keys(this.expenseForm.value)
    let formData = new FormData();
    keys.map(x => {
      if (this.expenseForm.value[x]) {
        formData.append(x, this.expenseForm.value[x])
      }
    })

    if (this.expenseId) {
      formData.append('id', this.expenseId);
      if (!this.expenseFormControl['file']?.value) {
        formData.append('bill', this.expenseDetail?.bill);
      }
    
      this._commonService.put(`Expense`, formData).subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['expense-details']);
            this._commonService.showToast('Expense updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          }
        },
        error: (err) => {
          let errorMessage = 'Something went wrong';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          }
          this._commonService.showToast(errorMessage, ToastType.ERROR, ToastType.ERROR);
        }
      });
    } else {
      this._commonService.post('Expense', formData).subscribe({
        next: (res) => {
          if (res) {
            this.router.navigate(['expense-details']);
            this._commonService.showToast('Expense added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          }
        },
        error: (err) => {
          let errorMessage = 'Something went wrong';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          }
          this._commonService.showToast(errorMessage, ToastType.ERROR, ToastType.ERROR);
        }
      });
    }
    
    this.expenseForm.reset();
  }

  getStatusLabel(status: number): string {
    return ExpenseStatusLabels[status] || 'Unknown';
  }

  onList() {
    this.router.navigate(['expense-details']);
  }
  trimNameOnBlur(controlName: string) {
    const control = this.expenseForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
