import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { categoryName, userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';

@Component({
  selector: 'app-asset-category-specification',
  templateUrl: './asset-category-specification.component.html',
  styleUrls: ['./asset-category-specification.component.scss'],
  standalone: true,
  imports: [CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTabsModule, ReactiveFormsModule,
  ]
})
export class AssetCategorySpecificationComponent implements OnInit {
  specificationFrom: FormGroup;
  loading: boolean = false;
  categoryData: Array<categoryName> = [];
  selectedCategory: string = "";
  specification: string = '';
  specificationList: string[] = [];
  public userRole: Array<userRole> = [];
  submitted: boolean = false;
  isView?: boolean;

  constructor(private router: Router, private apiService: ApiService, private _fb: FormBuilder, private sweetlalert: SweetalertService) {
    this.specificationFrom = this._fb.group({
      CategoryId: ['', [Validators.required]],
      Specification: [[], [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getCategoryData();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "AssetManagement";
      })
    }
  }

  async navigate() {
    const confirmed = await this.sweetlalert.showCancleConfirmation();
    if (confirmed) {
      this.router.navigateByUrl('asset-management');
    }
  };

  async createCategorySpecification() {

    this.specificationFrom.controls['Specification'].setValue(this.specificationList);
    if (this.specificationFrom.invalid) {
      this.specificationFrom.markAllAsTouched();
      this.submitted = true;
      return;
    }
    if (this.specificationList.length == 0) { return; }

    let obj = {
      categoryId: this.selectedCategory,
      categorySpecifications: this.specificationList
    }

    let result = await this.apiService.AddCategorySpecification(obj);
    if (result) {
      this.specificationList = [];
      this.selectedCategory = "";
      this.submitted = false;
      this.specificationFrom.get('CategoryId').setValue('');
      this.specificationFrom.get('Specification').setValue('');
    }
  }

  addSpecification() {
    this.specificationList.push(this.specification);
    this.specification = '';
  }

  async onCategorySelected(id) {
    await this.getCategoryData()
    this.selectedCategory = id.value;
    this.categoryData.filter((x) => {

      if (x.id === this.selectedCategory) {
        const filterCategory = x.categorySpecifications.map((x) => {
          this.getCategoryData()
          return x.specificationName
        })
        this.specificationList = filterCategory
      }
    })
  }

  delete(i) {
    this.specificationList = this.specificationList.filter((item, index) => index != i)
  }

  async getCategoryData() {
    this.categoryData = await this.apiService.getCategory();

  }
}
