import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateListComponent } from './template-list/template-list.component';
import { TemplateDetailComponent } from './template-detail/template-detail.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TemplateRoutingModule
  ]
})
export class TemplateModule { }
