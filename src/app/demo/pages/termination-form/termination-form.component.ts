import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { InsurancePerson } from 'src/app/assets.model';

export enum TerminationType {
  Dismissal = 0,
  Termination = 1
}

@Component({
  selector: 'app-termination-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatDatepickerModule, MatFormFieldModule,
    ReactiveFormsModule, AngularEditorModule, MatSelectModule],
  templateUrl: './termination-form.component.html',
  styleUrls: ['./termination-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TerminationFormComponent implements OnInit {
  terminationForm: FormGroup;
  public getAllEmployeeList: InsurancePerson[];
  terminatedList = [
    { name: 'Dismissal', value: TerminationType.Dismissal },
    { name: 'Termination', value: TerminationType.Termination }
  ]
  public getTerminationList: any;
  id: string = '';

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getAllEmployeePerson();
  }
  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private api: CommonService,
    private route: Router,
    private activeRoute: ActivatedRoute,) {
    this.terminationForm = this.buildForm();
  }

  buildForm() {
    return this._fb.group({
      employeeId: ['', Validators.required],
      terminationType: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  getAllEmployeePerson() {
    this.api.get('Person/listemployee').subscribe(res => {
      this.getAllEmployeeList = res;
      this.getAllEmployeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }

  onList() {
    this.router.navigate(['/termination-list'])
  }

  // Create termination of employee
  submit() {
    if (this.terminationForm.invalid) {
      this.terminationForm.markAllAsTouched();
      return;
    }
    this.api.post('Termination', this.terminationForm.value).subscribe(res => {
      this.getTerminationDetail();
      this.api.showToast('Termination added successfully', ToastType.SUCCESS, ToastType.SUCCESS)

    }, (err) => {
      this.api.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
    })
    this.terminationForm.reset();
    this.onList();
  }

  // get all termination
  getTerminationDetail() {
    this.api.get('Termination').subscribe(res => {
      this.getTerminationList = res;
    })
  }

  get terminationFormControl() {
    return this.terminationForm.controls;
  }
  trimNameOnBlur(controlName: string) {
    const control = this.terminationForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }

}
