import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastType } from '../../service/common/common.service';
import { CommonService } from 'src/app/service/common/common.service';
export interface Category {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySpecifications: any
}
export interface Asset {
  id: string;
  assetId: string;
  assetName: string;
  brand: string;
  status: number;
  isActive: boolean;
}

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    FormsModule, MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule]
})
export class AddAssetComponent {

  assetForm: FormGroup;
  categoryData: Category[];
  assetData: Asset;
  id: string = '';
  title: string ;
  buttonName: string = "Save";
  isView?: boolean;
  selectedCategory: { value: string }
  filterData: any
  specificationName: []
  isSubmitting : boolean = false;
  constructor(private api: CommonService, private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private apiService: ApiService,) {
    this.assetForm = this._fb.group({
      categoryId: ['0', [Validators.required]],
      assetName: ['', [Validators.required, Validators.maxLength(50),]],
      description: ['', Validators.required, Validators.maxLength(1000)],
      brand: ['', [Validators.required, Validators.maxLength(25),]],
      status: [0],
      isActive: [true],
    })
  }

  public get getAssetFormControl() {
    return this.assetForm.controls
  }

  async ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.categoryData = await this.apiService.getCategory();

    if (this.id) {
      this.title = "Edit asset";
      this.buttonName = "update";
      let data = await this.apiService.getAssetById(this.id);
      this.assetData = data.value;
      this.assetForm.patchValue(this.assetData);
      this.filterData = data?.value?.assetSpecifications ?? [];
    }
  }

  onCategorySelected(id) {
    this.filterData = []
    this.selectedCategory = id;
    this.filterData = this.categoryData.find((item) => item.id == id.value)?.categorySpecifications;
    this.filterData.map(x => {
      x['specificationValue'] = '';
      return x;
    })
  }

  async createAsset() {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
  
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }
  
    let assetSpecifications = this.filterData?.map(x => ({
      specificationName: x.specificationName,
      specificationValue: x.specificationValue
    }));
  
    let payload = assetSpecifications?.length ? { assetSpecifications: assetSpecifications } : {};
  
    try {
      let result;
      if (this.id !== '') {
        let obj = { ...this.assetData, ...this.assetForm.value };
        payload = { ...payload, ...obj };
        result = await this.apiService.updateAsset(payload);
        if (result) {
          this.api.showToast('Asset Management Update Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      } else {
        payload = { ...payload, ...this.assetForm.value };
        result = await this.apiService.addAsset(payload);
        if (result) {
          this.api.showToast('Asset Management Save Successfully.', ToastType.SUCCESS, ToastType.SUCCESS);
        }
      }
      
      if (result) {
        this.navigate();
      }
    } catch (error) {
      this.api.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR);
    } finally {
      this.isSubmitting = false;
    }
  }
  
  trimNameOnBlur(controlName: string) {
    const control = this.assetForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }


  navigate = function () {
    this.router.navigateByUrl('/asset-management');
  };
}
