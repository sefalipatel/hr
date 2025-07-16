import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public show = false;
  public newPassword = 'password';
  public confirmPassword = 'password';
  public email: any;
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  favIcon: string = '';
  orgTitle: string = '';
  
  constructor(private fb: FormBuilder, private commonService: CommonService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#.?&])[A-Za-z\d$@$!%*?&].{7,14}$")]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords })
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
  submit() {
    const newPasswaord = this.resetPasswordForm.value.newPassword;
    const confirmPassword = this.resetPasswordForm.value.confirmPassword;
    this.commonService.put(`Auth/setNewPassword?password=${newPasswaord}&confirmPassword=${confirmPassword}&email=${this.email}`, this.resetPasswordForm.value).subscribe(res => {
      if (res?.statusCode == 200) {
        this.commonService.showToast('Password has been reset successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.router.navigate(['login']);
      }
    })
  }

  onNewClick() {
    if (this.newPassword === 'Password') {
      this.newPassword = 'text';
      this.show = true;
    } else {
      this.newPassword = 'Password';
      this.show = false;
    }
  }

  onConfirmClick() {
    this.confirmPassword = this.confirmPassword === 'password' ? 'text' : 'password';
    this.show = this.confirmPassword === 'password' ? true : false;
  }
  // New password and confirm password match funtion
  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('newPassword')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    return pass == confirmPass ? null : { notSame: true }
  }
}
