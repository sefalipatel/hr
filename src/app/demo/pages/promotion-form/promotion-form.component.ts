import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { InsurancePerson } from 'src/app/assets.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDatepickerModule],
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss']
})
export class PromotionFormComponent implements OnInit {
  public promotionForm: FormGroup;
  public promotionId: string;
  public getAllEmployeeList: InsurancePerson[];
  public getEmployeeId: any[] = [];
  public designationList: any[] = [];
  public promotionByEmployeeId: any;
  id: string = '';
  isSubmitting : boolean = false

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService) {
    this.promotionForm = this.buildForm();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.route.params.subscribe(async (params) => {
      this.promotionId = this.promotionId ?? params['id']
    })
    this.getAllEmployeePerson();
    this.getAllDesignation();
    if (this.promotionId) {
      this.getByPromotionId();
    }
  }

  buildForm() {
    return this.formBuilder.group({
      employeeId: ['', Validators.required],
      designationId: [],
      designationName: [{ value: '', disabled: true }],
      newDesignationid: ['', Validators.required],
      promotionDate: [new Date()]
    })
  }

  // get all employee person
  getAllEmployeePerson() {
    this.commonService.get('Person/listemployee').subscribe(res => {
      this.getAllEmployeeList = res;
      this.getAllEmployeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }

  // get all designation list
  getAllDesignation() {
    this.commonService.get(`Designation/listdesignation`).subscribe((res) => {
      this.designationList = res;
    })
  }

  onEmployeeChange(event: any): void {
    this.commonService.get(`Promotion/PersonByDesignation?employeeId=${event.value}`).subscribe(res => {
      this.promotionForm.patchValue({
        designationName: res?.value[0]?.designationName,
        designationId: res?.value[0]?.designationId
      });
    })
  }

  // Form submit
  submit() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.promotionForm.invalid) {
      this.promotionForm.markAllAsTouched();
      return;
    }
    if (this.promotionId) {
      let payLoad = {
        id: this.promotionId,
        oldDesignationid: this.promotionForm.get('designationId').value,
        ...this.promotionForm.value
      }
      this.commonService.put('Promotion', payLoad).subscribe(res => {
        this.commonService.showToast('Promotion updated successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.onList();
      })
    } else {
      let payLoad = {
        oldDesignationid: this.promotionForm.get('designationId').value,
        ...this.promotionForm.value
      }
      this.commonService.post('Promotion', payLoad).subscribe(res => {
        this.commonService.showToast('Promotion added successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.onList();
        this.promotionForm.reset();
      })
    }
  }

  // get data by id
  getByPromotionId() {
    this.commonService.get(`Promotion/${this.promotionId}`).subscribe(res => {
      if (res) {
        this.promotionForm.patchValue(res);
        this.promotionForm.patchValue({
          designationName: res?.oldDesignation?.name,
          designationId: res?.oldDesignation?.id
        });
      }
    })
  }

  // Go on list
  onList() {
    this.router.navigate(['promotion']);
  }

}
