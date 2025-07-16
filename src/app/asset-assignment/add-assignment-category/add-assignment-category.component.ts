import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/service/common/common.model';
import { assetsAssignment } from 'src/app/assets.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-assignment-category',
  standalone: true,
  imports: [MatFormFieldModule, SharedModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatNativeDateModule, MatTabsModule ],
  templateUrl: './add-assignment-category.component.html',
  styleUrls: ['./add-assignment-category.component.scss']
})
export default class AddAssignmentCategoryComponent {
  form: FormGroup;
  Person: Array<assetsAssignment> = [];
  Asset: Array<assetsAssignment> = [];
  requestId: string;
  Category: Array<assetsAssignment> = [];
  categoryId: string = '';
  assetdetails;
  isView?: boolean;
  isSubmitting : boolean = false;
  minDate: Date;
  maxDate: Date;
  assetId: any; assignmentDate
  constructor(private formBuilder: FormBuilder, private router: Router, private api: CommonService, private datePipe: DatePipe,
    private route: ActivatedRoute,) {
    this.form = this.formBuilder.group({
      userId: ['', Validators.required],
      categoryId: ['', Validators.required],
      assetsId: [[], Validators.required],
      assignmentDate: [new Date(), Validators.required],
      remark: [''],
      returnDate: ['']
    })
    const currentDate = new Date();
    this.minDate = currentDate;
    this.maxDate = currentDate;

  }
  employeelist;

  ngOnInit() {
    this.api.get(`Person/listemployee`).subscribe((response) => {
      this.Person = response
      this.Person.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
    this.api.get(`Category`).subscribe((response) => {
      this.Category = response;
    })
    this.requestId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.requestId) {
      this.api.get(`AssetAssignment/${this.requestId}`).subscribe((res) => {
        this.form.patchValue(res);
        this.form.get("assetsId").patchValue(res?.assetId)
        this.categoryId = res?.categoryId;
        this.assetdetails = res
        this.getAssetByCategory(this.categoryId);
        this.assetId = res?.assetId[0];
      })
    }
  }

  getAssetByCategory(categoryId) {
    this.api.get(`Asset/category/${categoryId}/${this.requestId ? false : true}`).subscribe((res) => {
      this.Asset = res
      this.form.get("assetsId").setValue(this.assetdetails?.assetId)
    })
  }
  createAssignment() {
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.form.valid) {
      const formattedAssignmentDate = this.datePipe.transform(this.form.value.assignmentDate, 'yyyy-MM-ddTHH:mm:ss');
      const formattedRetuenDate = this.datePipe.transform(this.form.value.returnDate, 'yyyy-MM-ddTHH:mm:ss');
      this.form.patchValue({ assignmentDate: formattedAssignmentDate, returnDate: formattedRetuenDate });
      if (this.requestId) {
        this.form.addControl("id", this.formBuilder.control('', Validators.required));
        this.form.get("id").setValue(this.requestId)
        this.api.put(`AssetAssignment/UpdateMultipleAssetAssignment`, this.form.value).subscribe((res) => {
          if (res) {
            this.api.showToast('Asset Assignment Updated Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.router.navigate(['asset-assign-details'])
          }
        })
      } else {
        this.api.post(`AssetAssignment/MultipleAssetAssignment`, this.form.value).subscribe((res) => {
          if (res?.length) {

            this.api.showToast('Asset Assignment Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
            this.isSubmitting = false
            this.router.navigate(['asset-assign-details'])
          }
          if (res.statusCode == 500) {
            this.api.showToast(res.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
          }
        })
      }
    } else {
      this.form.markAllAsTouched()
    }
  }
  Cancel() {
    this.router.navigate(['asset-assign-details'])
  }
  navigate = function () {
    this.router.navigateByUrl('/asset-assign-details');
  };
}


