import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, SharedModule, NgOtpInputModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  public verifyOTPForm: FormGroup;
  public otp: any;
  public showOtpComponent = true;
  resendDisabled: boolean = false;
  timer: number = 0;

  public email: string;
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  favIcon: string = '';
  orgTitle: string = '';
  
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
  }

  ngOnInit(): void {
    this.commonService.currentEmail$.subscribe(mailId => {
      this.email = mailId;
    });

    this.getOrgIcon();
    this.getOrgTitle();
  }

  getOrgIcon() {
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
  }

  getOrgTitle() {
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

  handeOtpChange(value: string[]): void {
 
  }

  onOtpChange(otp) {
    this.otp = this.verifyOTPForm.controls['otp'].setValue(otp);
  }

  resendOTP() {
    this.commonService.post(`Auth/forgotPassword?email=${this.email}`, null).subscribe(res => {
      if (res) {
        this.resendDisabled = true;
        this.startTimer();
        this.commonService.showToast("OTP resend successfully", ToastType.SUCCESS, ToastType.SUCCESS)
      }
    }, (err) => {
      this.commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  startTimer() {
    this.resendDisabled = true;
    this.timer = 60;

    const interval = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(interval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  submit() {
    const receivedOtp = this.verifyOTPForm.value.otp;
    this.commonService.post(`Auth/verifyOTP?otp=${receivedOtp}&email=${this.email}`, this.otp).subscribe(res => {
      if (res === true) {
        this.router.navigate(['reset-password']);
      } else if (res === false) {
        this.commonService.showToast("Invalid OTP, Please enter correct OTP", ToastType.ERROR, ToastType.ERROR)
        this.router.navigate(['verify-otp']);
      }
    });
  }
}
