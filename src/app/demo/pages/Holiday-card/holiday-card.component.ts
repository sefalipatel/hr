import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-holiday-card',
  standalone: true,
  imports: [CommonModule, SharedModule, MatSlideToggleModule, MatDatepickerModule, MatInputModule, MatFormFieldModule, MatNativeDateModule, MatButtonModule, MatDividerModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './holiday-card.component.html',
  styleUrls: ['./holiday-card.component.scss'],
  providers: [DatePipe]
})

export default class HolidaycardCompon {
  itemId: string;
  form: FormGroup;
  showErrors: boolean = false;
  isView?: boolean;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      optional: [false]
    });
  }

  ngOnInit() {
  }

  async saveData() {
    this.showErrors = true
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(this.form.value.date, 'yyyy-MM-dd');
    this.form.patchValue({ date: formattedDate });
    if (this.form.valid) {
      try {
        const response = await this.apiService.postData(this.form.value);
        if (response.statusCode === 200) {
          setTimeout(() => {
            this.router.navigateByUrl('holiday-details');
          }, 1000);
          this.toastr.success('Add Success!', 'Success!');
          this.
            form.reset();
        }
        if (response.statusCode == 500) {
          this.toastr.error('Duplicate date selected!', 'Error');
        }
      } catch (error) {
        if (error.statusCode == 500) {
          this.toastr.error('Duplicate date selected!', 'Error');
        }
      }
    } else {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
    }
  }

  async updateData() {
    try {
      const response = await this.apiService.putData(this.itemId, this.form.value);
      if (response.statusCode === 200) {
        this.toastr.success('Item updated successfully!', 'Success');
        this.router.navigateByUrl('holiday-details');
      }
    } catch (error) {
      this.toastr.error('Failed to update item!', 'Error');
    }
  }

  navigate = function () {
    this.router.navigateByUrl('holiday-details');
  };

  get date() {
    return this.form.get('date');
  }

  get description() {
    return this.form.get('description');
  }

  trimNameOnBlur() {
    const control = this.form.get('description');
    if (control?.value) {
      // Trim leading and trailing spaces only when the input loses focus
      const trimmedValue = control.value.trim();
      // Set the trimmed value back to the form control
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
