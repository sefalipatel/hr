import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentCategoryComponent } from './assignment-category/assignment-category.component';
// import { AddAssignmentCategoryComponent } from './add-assignment-category/add-assignment-category.component';
import { AssetAssignmentComponent } from './asset-assignment.component';

const routes: Routes = [
  { path: '', component: AssetAssignmentComponent, redirectTo:'AssetAssignment', pathMatch:'full' },
  { path: 'AssetAssignment', component: AssignmentCategoryComponent},  
  // { path: 'addAssetCategory', component: AddAssignmentCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetAssignmentRoutingModule { }
