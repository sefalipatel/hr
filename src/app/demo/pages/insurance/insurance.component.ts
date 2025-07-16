import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastType } from 'src/app/demo/models/models';
@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, SharedModule],
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {
  InsuranceForm: FormGroup;
  id: string = '';
  loading: boolean = false;
  submitted: boolean;
  public AddInsuranceId!: string;
  isAddInsurance: boolean = true;
  filteredSubTypeData: any[] = [];
  visitorSubTypeData: any[] = [];
  isSubmitting : boolean =false;
  constructor(private _fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _commonService: CommonService,
    private route: Router,) {
    this.InsuranceForm = this.buildForm();
    this.submitted = false;
  }
  buildForm() {
    return this._fb.group({
      companyName: ['', [Validators.required]],
      planType: ['', [Validators.required]],
      coverAmount: [0, Validators.required],
      coveragePeriod: ['', [Validators.required]],
      cover: [''],
      OrganizationId: [localStorage.getItem('orgId')], 
    })

  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.AddInsuranceId = this.activeRoute.snapshot.paramMap.get('id') ?? '';
    this.isAddInsurance = this.AddInsuranceId ? false : true
    this.gettInsuranceId(this.AddInsuranceId);
  }

  reset() {
    this.InsuranceForm.reset();
    this.isAddInsurance = false;
    this.AddInsuranceId = '';
  }
  AddInsurance() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.InsuranceForm.invalid) {
          this.InsuranceForm.markAllAsTouched();
          return;
        }
    if (this.isAddInsurance) {
      this._commonService.post('Insurance', this.InsuranceForm.value).subscribe((res) => {
        if (res?.statusCode == 200) {
          this._commonService.showToast('Insurance added successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/insurance-master']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    } else {
      this._commonService.put('Insurance', { id: this.AddInsuranceId, companyName: this.InsuranceForm.value.companyName, OrganizationId: this.InsuranceForm.value.OrganizationId, cover: this.InsuranceForm.value.cover, coverAmount: this.InsuranceForm.value.coverAmount, coveragePeriod: this.InsuranceForm.value.coveragePeriod, planType: this.InsuranceForm.value.planType }).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Insurance updated successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isSubmitting = false
          this.route.navigate(['/insurance-master']);
        } else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  gettInsuranceId(id: string) {
    this._commonService.get(`${'Insurance'}/${id}`).subscribe((res) => {
      if (res?.statusCode == 200) {
        if (res?.value) {
          this.filteredSubType(res?.value);
        }
        this.InsuranceForm.patchValue(res?.value);
      }
    });
  }
  filteredSubType(visitorTypeId: string) {
    let filteredSubType = this.visitorSubTypeData.filter(res => res.visitorTypeId === visitorTypeId)
    this.filteredSubTypeData = filteredSubType;
  }
  onList() {
    this.router.navigate(['insurance-master'])
  }

  trimNameOnBlur(controlName: string) {
    const control = this.InsuranceForm.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
