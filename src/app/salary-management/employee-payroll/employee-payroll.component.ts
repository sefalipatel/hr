import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-employee-payroll',
  standalone: true,
  imports: [CommonModule,MatSelectModule,DatePipe,ReactiveFormsModule],
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.scss']
})
export default class EmployeePayrollComponent {
  earningFieldAdded: boolean = false;
  deductionFieldAdded: boolean = false;
  EarningData: any;
  Deduction: any;
  Person:any
  public variationForm: FormGroup;
  selectionVAlue: any;
  employeeData: any;

  constructor(private api: CommonService,  private fb: FormBuilder,) {  this.variationForm = this.buildForm(); }

  ngOnInit() {
    this.GetAllEarning()
    this.GetAllDeduction()
    this.GetAllPersonData()
  }

  buildForm() {
    return this.fb.group({
      personId:[''],
      annualCTC:[''],
      earnings: this.fb.array([this.EarningForm()]),
      deductions:this.fb.array([])     
    })
  }
  EarningForm() {
     return this.fb.group({  
      id:[''],     
      amount:[''],
      percentage:[''],
     }
     )
  }
  DeductionForm(){
    return this.fb.group({
      id:[''], 
      calucationType:[''], 
      amount:[''],
      percentage:[''],
    })
  }
  get variationDetailName() {
    return (this.variationForm.get('earnings') as FormArray).controls;
  }
  get DeductionDetails() {
    return (this.variationForm.get('deductions') as FormArray).controls;   
  }

  createInputField() {
    return this.fb.group({
      variationDetailName: [ ],
      DeductionDetails:[]
    })
  }

  GetAllEarning() {
    this.api.get(`Earning`).subscribe((x) => {
      this.EarningData = (x
      )
    })
  }
  GetAllDeduction() {
    this.api.get(`Deduction`).subscribe((x) => {
      this.Deduction = (x
      )
    })
  }
  GetAllPersonData(){
    this.api.get(`Person`).subscribe((x) => {     
      this.Person = (x
      )
    })
  }
  selectCalucationType(person){
   this.selectionVAlue=person.value
   
  }
  addpersondata() {
    this.api.get(`PayRoll/person/05C50335-B0F8-4697-97CC-B65AF518B5F7`).subscribe((x) => { 
    })
  }
  
  creatPayroll(){
    this.variationForm.get('personId').setValue("05C50335-B0F8-4697-97CC-B65AF518B5F7")
  }
  
  EarningDataList(data) {
    if (data.name === "Basic" && !this.earningFieldAdded) {
      (this.variationForm.get('earnings') as FormArray).push(this.createInputField());
      this.earningFieldAdded = true;
    }
  }

  DeductionList(data){
    if (data.name === "The Moon" && !this.deductionFieldAdded) {
      (this.variationForm.get('deductions') as FormArray).push(this.createInputField());
      this.deductionFieldAdded = true;
    }
  }
  
  removeInputField(index: number) {     
      (this.variationForm.get('earnings') as FormArray).removeAt(index);
      this.earningFieldAdded = false;
    }
    removeInputFieldDeduction(index: number){
      (this.variationForm.get('deductions') as FormArray).removeAt(index);
      this.deductionFieldAdded = false;
    }  
}
