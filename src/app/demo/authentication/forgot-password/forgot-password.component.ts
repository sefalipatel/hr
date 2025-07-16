import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  public forgotPasswordForm: FormGroup;
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  favIcon: string = '';
  orgTitle: string = '';
  
  constructor(private fb: FormBuilder, private commonService: CommonService, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    })
  }
  ngOnInit(): void {
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

  submit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    const mailId = this.forgotPasswordForm.value.email;
    this.commonService.post(`Auth/forgotPassword?email=${mailId}`, null).subscribe(res => {
      if (res.message === "OTP sent to your email") {
        this.router.navigate(['/verify-otp']);
        this.commonService.sendMailId(mailId);
        this.commonService.showToast('OTP sent to your email', ToastType.SUCCESS, ToastType.SUCCESS)
      } else if (res.message === "Invalid email") {
        this.commonService.showToast("Invalid email", ToastType.ERROR, ToastType.ERROR)
      } else if (res.message === "OTP could not be sent via email.Please contact support for assistance.") {
        this.commonService.showToast("OTP could not be sent via email.Please contact support for assistance", ToastType.ERROR, ToastType.ERROR)
      }
    }, error => {
      this.commonService.showToast("Something Went Wrong", ToastType.ERROR, ToastType.ERROR);
    })
  }
}
