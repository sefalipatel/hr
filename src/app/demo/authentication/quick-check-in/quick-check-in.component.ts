import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../pages/role-list/sweetalert.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastType } from '../../models/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quick-check-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './quick-check-in.component.html',
  styleUrls: ['./quick-check-in.component.scss']
})
export class QuickCheckInComponent implements OnInit{

  public checkInForm: FormGroup<any>;
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  favIcon: string = '';
  orgTitle: string = '';

  constructor(private _commonService: CommonService, private route: ActivatedRoute, private formBuilder: FormBuilder, public dialog: MatDialog, private datePipe: DatePipe, private sweetlalert: SweetalertService, private router: Router) {
    this.checkInForm = this.buildForm();
  }
  ngOnInit(): void {
    this.getOrgIcon();
    this.getOrgTitle();
  }

  buildForm() {
    return this.formBuilder.group({
      contactNumber: ['', [Validators.required, this.emailOrPhoneValidator()]],
    })
  }

  getOrgIcon() {
    this._commonService.favIcon$.subscribe((newFavicon) => {
      if (newFavicon) {
        this.favIcon = this.imageUrl + newFavicon;
      }
    });

    // Load from localStorage 
    const savedFavicon = localStorage.getItem('favIcon');
    if (savedFavicon) {
      this.favIcon = this.imageUrl + savedFavicon;
    }
  }

  getOrgTitle() {
    this._commonService.title$.subscribe((orgtitle) => {
      if (orgtitle) {
        this.orgTitle = orgtitle
      }
    })

    const orgName = localStorage.getItem('title');
    if (orgName) {
      this.orgTitle = orgName
    }
  }

  submit() {
    if (this.checkInForm.invalid) {
      this.checkInForm.markAllAsTouched();
      return;
    }

    let contactNumber = this.checkInForm.value.contactNumber;
    let payload = {};

    if(contactNumber.toString().includes('@')) {
      payload = {
        emailId: contactNumber
      }
    }
    else{
      payload = {
        mobileNo: contactNumber
      }
    }
    this._commonService.post(`QuickCheckIn/QuickCheckIn`, payload)?.subscribe(res => {
      this._commonService.showToast('OTP sent to you successfully', ToastType.SUCCESS, ToastType.SUCCESS)
      this._commonService.sendContactNumber(contactNumber);
      this.router.navigate(['verify-checkIn-otp']);
    }, error => {
      this._commonService.showToast("Something Went Wrong", ToastType.ERROR, ToastType.ERROR);
    })
  }

  emailOrPhoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (!value) {
        return null;
      }
  
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const phonePattern = /^[0-9]{10,15}$/;
  
      const isEmailValid = emailPattern.test(value);
      const isPhoneValid = phonePattern.test(value);
  
      if (isEmailValid || isPhoneValid) {
        return null; 
      } else {
        return { emailOrPhone: true }; 
      }
    };
  }

}

