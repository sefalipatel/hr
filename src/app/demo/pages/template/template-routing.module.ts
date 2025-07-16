import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () =>
      import('./template-list/template-list.component').then((m) => m.TemplateListComponent)
  },
  {
    path: 'add-template',
    loadComponent: () =>
      import('./template-detail/template-detail.component').then((m) => m.TemplateDetailComponent)
  },
  {
    path: 'add-template/:id',
    loadComponent: () =>
      import('./template-detail/template-detail.component').then((m) => m.TemplateDetailComponent)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
