import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  imports: [
    MatButtonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatStepperModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDividerModule,
    MatRadioModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    MatButtonModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatStepperModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressBarModule,
    MatChipsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatDividerModule,
    MatRadioModule,
    NgxMaterialTimepickerModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class MaterialModule { }
