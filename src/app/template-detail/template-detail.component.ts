import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent {
  form: FormGroup;
  constructor(
    private router: Router, 
  ) {

  }
  navigate = function () {
    this.router.navigateByUrl('template');
  };
}
