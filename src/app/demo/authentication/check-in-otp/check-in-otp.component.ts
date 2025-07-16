import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-check-in-otp',
  standalone: true,
  imports: [CommonModule, SharedModule, NgOtpInputModule, MaterialModule],
  templateUrl: './check-in-otp.component.html',
  styleUrls: ['./check-in-otp.component.scss']
})
export class CheckInOtpComponent {
  public verifyOTPForm: FormGroup;
  public otp: any;
  public checkInStatus: number;
  public contact: string;
  userId: string = '';
  public inOutStatus: any;
  public activeStatus: any;
  public showOtpComponent = true;
  public showButton: boolean = false;
  imageUrl: string = environment.apiUrl.replace('api/', '');
  favIcon: string = '';
  orgTitle: string = '';
  public timerSubscription: Subscription;
  checkOutStatus: { value: number, name: string }[] = [
    { value: 2, name: 'On Break' },
    { value: 0, name: 'End of Day' }
  ]

  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };

  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private router: Router) {
    this.verifyOTPForm = this.formBuilder.group({
      otp: ['']
    });

    setTimeout(() => {
      this.showButton = true;
    }, 3000);
  }

  ngOnInit(): void {
    this.commonService.contactNumber$.subscribe(num => {
      this.contact = num;
    });

    this.commonService.favIcon$.subscribe((newFavicon) => {
      if (newFavicon) {
        this.favIcon = this.imageUrl + newFavicon;
      }
    });

    // Load from localStorage 
    const savedFavicon = localStorage.getItem('favIcon');
    if (savedFavicon) {
      this.favIcon = this.imageUrl + savedFavicon;
    }

    this.commonService.title$.subscribe((orgtitle) => {
      if (orgtitle) {
        this.orgTitle = orgtitle
      }
    })

    const orgName = localStorage.getItem('title');
    if (orgName) {
      this.orgTitle = orgName
    }
  }

  onOtpChange(otp) {
    this.otp = this.verifyOTPForm.controls['otp'].setValue(otp);
  }

  submit() {
    const receivedOtp = this.verifyOTPForm?.value?.otp;
    let email = '';
    let mobile = '';
    this.contact.toString().includes('@') ? email = this.contact : mobile = this.contact;
    
    this.commonService.post(`QuickCheckIn/VerifyEmailMobileWithOTP?otp=${receivedOtp}&email=${email}&Mobile=${mobile}`, this.otp).subscribe(res => {
      if (res) {
        this.userId = res?.value?.id
        this.checkInStatus = res?.value?.status
        this.commonService.showToast("OTP varified successfully", ToastType.SUCCESS, ToastType.SUCCESS);
      }
      else if(res === false) {
        this.commonService.showToast("OTP is not varified", ToastType.ERROR, ToastType.ERROR)
      }
    },_err => {
      this.commonService.showToast("Invalid OTP, Please enter correct OTP", ToastType.ERROR, ToastType.ERROR)
    });
  }

  startCountdown(data) {
    this.showButton = false;
    const activeStatus = 1

    const key = environment?.authenticationKey;
    const header = new Headers({ 'Authorization': `${key}` });
    const options = {
      headers: header,
    };
    this.commonService.post(`QuickCheckIn/CheckInOut/${this.userId}/${activeStatus}`, '', options).subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.showButton = true;
        }, 3000);
        localStorage.removeItem('LastCheckInOutStatus');
        this.inOutStatus = true;
        this.router.navigate(['/login']);

        localStorage.setItem('LastCheckInOutStatus', '1');
        this.commonService.showToast(res.value.inOutStatus, ToastType.SUCCESS, ToastType.SUCCESS);
      }
    }, (error) => {
      this.showButton = true;
    }
    );
  }

  OnCheckOutStatus(element) {
    this.showButton = false;
    const activeStatus = element.value;

    const key = environment?.authenticationKey;
    const header = new Headers({ 'Authorization': `${key}` });
    const options = {
      headers: header,
    };

    this.commonService.post(`QuickCheckIn/CheckInOut/${this.userId}/${activeStatus}`, '', options).subscribe((res) => {
      if (res?.statusCode == 200) {
        setTimeout(() => {
          this.showButton = true;
        }, 3000);
        localStorage.removeItem('LastCheckInOutStatus');
        this.inOutStatus = false;
        this.router.navigate(['/login']);

        localStorage.setItem('LastCheckInOutStatus', this.activeStatus);
        this.commonService.showToast(res.value.inOutStatus, ToastType.SUCCESS, ToastType.SUCCESS);
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
          this.timerSubscription = undefined;
        }
      }
    }, (error) => {
      this.showButton = true;
    }
    );
  }
}
