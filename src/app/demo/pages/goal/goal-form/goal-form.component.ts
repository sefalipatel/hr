import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { CommonService, ToastType } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, SharedModule,MatDatepickerModule, MaterialModule, MatNativeDateModule, MatSelectModule],
  templateUrl: './goal-form.component.html',
  styleUrls: ['./goal-form.component.scss']
})
export class GoalFormComponent implements OnInit {
  public goalForm: FormGroup;
  public goalTypeList: Array<any>;
  public isDisplay: boolean = false;
  maxDate: Date;
  goalId:any;
  id: string = '';
  isSubmitting : boolean = false;

  status = [
    {name: 'Active',id:true},
    {name: 'Inactive',id:false}
  ]

  constructor(private router: Router,private formBuilder: FormBuilder,  private activeRoute: ActivatedRoute,private _commonService: CommonService,private route : ActivatedRoute, private datePipe: DatePipe) { 
    this.goalForm = this.buildForm();
    this.route?.params?.subscribe(async (params) => {
      this.goalId = params['id'];
    });
  }

  buildForm() {
    return this.formBuilder.group({
      goalTypeId: ["", [Validators.required]],
      subject: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: [ ,[Validators.required]],
      description: ["",[Validators.required]],
      status:['']
    })
  }

  get goalFormControl() {
    return this.goalForm.controls;
  }

  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
    this.getGoalTypeData();
    if(this.goalId){
    this.getGoalById(this.goalId);
  }
  }

  onList() {
    this.router.navigate(['goal-details'])
  }

  getGoalTypeData() {
    this._commonService.get(`GoalType`).subscribe(res => { 
      this.goalTypeList = res.filter(x => x.status === true); 
    })
  }

  getGoalById(id: string) {  
    this._commonService.get(`Goal/${id}`).subscribe(res => {
      this.goalForm.patchValue(res);
      const statusValue = res.status ? true : false;
      this.goalForm.get('status').setValue(statusValue);
      this.isDisplay = true;
      this.goalId = res.id;   
    })
  }

  addgoal(){
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true;
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }
    
    const formattedDate = this.datePipe.transform(this.goalForm.value.startDate, 'yyyy-MM-ddTHH:mm:ss');
    const formattedEndDate = this.datePipe.transform(this.goalForm.value.endDate, 'yyyy-MM-ddTHH:mm:ss');
    this.goalForm.patchValue({ startDate: formattedDate, endDate: formattedEndDate});

    let payload = {
      personId: JSON.parse(localStorage.getItem('userInfo'))?.personID,
      ...this.goalForm.value
    }

    if(this.goalId){              
     payload = {
        id : this.goalId,
        ...payload
      }
      this._commonService.put(`Goal`, payload).subscribe(res => {
        if (res) {
          this.router.navigate(['goal-details']);
          this._commonService.showToast('Goal updated successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }else{
      this._commonService.post(`Goal`,payload).subscribe(res => {
        if (res) {
          this.router.navigate(['goal-details']);
          this._commonService.showToast('Goal added successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.isSubmitting = false;
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })    
    }
  }

  trimNameOnBlur(controlName: string) {
    const control = this.goalForm.get(controlName);
    if (control?.value) {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue, { emitEvent: false });
    }
  }
}
