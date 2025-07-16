import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/demo/models/models';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule],
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

  public basicInfoForm: FormGroup;
  contactType = [
    { name: 'Company', value: 0 },
    { name: 'Person', value: 1 }
  ];
  visibility = [
    { name: 'Private', value: false },
    { name: 'Public', value: true }
  ]
  @Input() companyId: string;
  @Input() public set getDataById(data: any) {
    this._getDataById = data;
    if (this.companyId) {
      this.basicInfoForm.patchValue(this._getDataById?.companyPerson);
    }
  }
  public get getDataById(): any {
    return this._getDataById;
  }
  private _getDataById!: any;
  isSubmitting : boolean = false;

  constructor(private _fb: FormBuilder, private router: Router, private _commonService: CommonService) {
    this.basicInfoForm = this.buildForm()
  }

  ngOnInit() {
  }
  buildForm() {
    return this._fb.group({
      status: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phoneNumber: ['', [Validators.required,   Validators.pattern(/^[1-9][0-9]{9,14}$/) ]],
      website: [''],
      alternativePhoneNumber: [''],
      description: [''],
    })
  }

  submit() {
    if(this.isSubmitting){
      return
    }
    if (this.basicInfoForm.invalid) {
      this.basicInfoForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true
    let payload = {
      id: this.companyId,
      ...this.basicInfoForm.value
    }
    
    if (this.companyId) {
      this._commonService.put(`CompanyPerson`, payload).subscribe(res => {
        this._commonService.showToast('Basic information has been updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
    else {
      this._commonService.post(`CompanyPerson`, this.basicInfoForm.value).subscribe(res => {
        this._commonService.showToast('Basic information has been added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.router.navigate(['company-list']);
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  trimNameOnBlur(controlName: string) {
    const control = this.basicInfoForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
  onList() {
    this.router.navigate(['company-list']);
  }
}
