import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastType } from '../../service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
export interface Category {
  id: string;
  categoryId: string;
  categoryName: string;
}
@Component({
  selector: 'app-add-asset-category',
  templateUrl: './add-asset-category.component.html',
  styleUrls: ['./add-asset-category.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule,]
})
export class AddAssetCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  categoryData: Category;
  isDisabled: boolean = false;
  id: string = '';
  isView?: boolean;
  title: string ;
  buttonName: string = "Save";
  constructor(private api: CommonService, private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private apiService: ApiService,) {
    this.categoryForm = this._fb.group({
      categoryId: ['', [Validators.required, Validators.maxLength(25)]],
      categoryName: ['', [Validators.required, Validators.maxLength(25)]]
    })
  }

  public get getCategoryFormControl() {
    return this.categoryForm.controls
  }

  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getCategoryFormControl['categoryId'].enable()
    if (this.id) {
      this.title = "Edit category";
      this.buttonName = "Update";
      let data = await this.apiService.getAssetCategoryById(this.id);
      this.categoryData = data.value;
      this.getCategoryFormControl['categoryId'].setValue(this.categoryData.categoryId);
      this.getCategoryFormControl['categoryName'].setValue(this.categoryData.categoryName);
      this.getCategoryFormControl['categoryId'].disable()
    }
  }

  async createAsset() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    if (this.id != '') {
      let obj = { id: this.categoryData.id, CategoryId: this.categoryData.categoryId, ...this.categoryForm.value }
      let result = await this.apiService.updateCategory(obj);
      if (result)
        this.api.showToast('Asset Category Update Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      this.navigate();
    }
    else {
      let result = await this.apiService.addCategory(this.categoryForm.value);
      if (result)
        this.api.showToast('Asset Category Save Sucessfully.', ToastType.SUCCESS, ToastType.SUCCESS)
      this.navigate();
    }
  }
  trimNameOnBlur(controlName: string) {
    const control = this.categoryForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

  navigate = function () {
    this.router.navigateByUrl('/asset-category-details');
  };
}
