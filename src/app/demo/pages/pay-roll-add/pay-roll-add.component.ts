import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { InsurancePerson } from 'src/app/assets.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pay-roll-add',
  standalone: true,
  imports: [CommonModule, SharedModule, MatInputModule, MaterialModule],
  templateUrl: './pay-roll-add.component.html',
  styleUrls: ['./pay-roll-add.component.scss']
})
export class PayRollAddComponent implements OnInit {
  public getAllEmployeeList: InsurancePerson[];
  public addPayRollForm: FormGroup;
  id: string = '';

  constructor(private _commonService: CommonService,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.addPayRollForm = this.buildForm();
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getAllEmployeePerson();
  }

  buildForm() {
    return this.formBuilder.group({
      employeeId: ['', [Validators.required]],
      AnualCTC: ['', [Validators.required, Validators.pattern(`^[0-9]+(\.[0-9]+)?$`)]]
    })
  }

  get addPayRollFormControl() {
    return this.addPayRollForm.controls;
  }

  // get all employee person
  getAllEmployeePerson() {
    this._commonService.get('Person/listemployee').subscribe(res => {
      this.getAllEmployeeList = res;
      this.getAllEmployeeList.sort((a, b) => a.firstName.localeCompare(b.firstName)); //Desending order
    })
  }

  // submit button
  save() {
    if (this.addPayRollForm.invalid) {
      this.addPayRollForm.markAllAsTouched();
      return;
    }
    this._commonService.post('Payroll', this.addPayRollForm.value).subscribe(res => {
      if (res) {
        this.onList();
        this._commonService.showToast('Payroll has been successfully added', ToastType.SUCCESS, ToastType.SUCCESS);
      }
    })
  }

  onList() {
    this.router.navigate(['pay-roll']);
  }

}
