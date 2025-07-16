import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetManagementComponent } from './asset-management.component';
import { AssetCategoryComponent } from './asset-category/asset-category.component';
import { AddAssetCategoryComponent } from './add-asset-category/add-asset-category.component';
import { AssetCategorySpecificationComponent } from './asset-category-specification/asset-category-specification.component';
import { AssetComponent } from './asset/asset.component';
import { AddAssetComponent } from './add-asset/add-asset.component';

const routes: Routes = [
  { path: '', component: AssetManagementComponent, redirectTo:'assetManagement', pathMatch:'full' },
  { path: 'assetCategory', component: AssetCategoryComponent},  
  { path: 'addAssetCategory', component: AddAssetCategoryComponent},
  { path: 'addAssetCategory/:id', component: AddAssetCategoryComponent},
  { path: 'assetCategorySpecification', component: AssetCategorySpecificationComponent},
  { path: 'assetManagement', component: AssetComponent},
  { path: 'addAsset', component: AddAssetComponent},
  { path: 'addAsset/:id', component: AddAssetComponent},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
