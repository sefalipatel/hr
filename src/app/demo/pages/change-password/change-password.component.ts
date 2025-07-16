import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from '../../models/models';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent {
  isSubmitted: boolean;
  public changepasswordForm: FormGroup<any>;
  newpassword = 'password';
  confirmpassword = 'password';
  oldpassword = 'text';
  show = false;
  isVerified: boolean = true;

  constructor(
    private fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private api: CommonService) {
    this.changepasswordForm = this.buildForm();
    this.isSubmitted = false;
  }

  get changepasswordFormControl() {
    return this.changepasswordForm.controls;
  }

  buildForm() {
    return this.fb.group({
      oldPassword: ['', [Validators.required, Validators.maxLength(100)]],
      newpassword: this.activeRoute.snapshot.params['id'] ? [] : ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,14}$")]],
      confirmPassword: this.activeRoute.snapshot.params['id'] ? [] : ['', Validators.required,]
    }, { validators: this.checkPasswords })
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('newpassword')?.value;
    let confirmPass = group.get('confirmPassword')?.value
    let oldPass = group.get('oldPassword')?.value
    return pass === oldPass ? { match: true } : pass !== confirmPass ? { notSame: true } : null
  }

  onNewClick() {
    if (this.newpassword === 'password') {
      this.newpassword = 'text';
      this.show = true;
    } else {
      this.newpassword = 'password';
      this.show = false;
    }
  }

  onConfirmClick() {
    if (this.confirmpassword === 'password') {
      this.confirmpassword = 'text';
      this.show = true;
    } else {
      this.confirmpassword = 'password';
      this.show = false;
    }
  }

  onOldClick() {
    if (this.oldpassword === 'password') {
      this.oldpassword = 'text';
      this.show = true;
    } else {
      this.oldpassword = 'password';
      this.show = false;
    }
  }

  onSubmit() {
    if (this.changepasswordForm.invalid || !this.isVerified) {
      this.changepasswordForm.markAllAsTouched();
      this.isSubmitted = true;
      return;
    }
    let payload = {
      email: JSON.parse(localStorage.getItem('userInfo'))?.email,
      organizationId: localStorage.getItem('orgId'),
      oldPassword: this.changepasswordFormControl['oldPassword'].value,
      newpassword: this.changepasswordFormControl['newpassword'].value,
    }

    this.api.post(`Auth/ChangePassword`, payload).subscribe(data => {
      this.router.navigate([`/login`]);
      this.api.showToast('Password  changed successfully', ToastType.SUCCESS, ToastType.SUCCESS);
      this.changepasswordForm.reset();
    }, (error) => {
      this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

}
