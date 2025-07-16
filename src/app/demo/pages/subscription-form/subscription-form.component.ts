import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastType } from 'src/app/service/common/common.model';
import { MatSelectModule } from '@angular/material/select';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}
@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,ReactiveFormsModule,MatInputModule,MatSelectModule,FormsModule,MatCheckboxModule],
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.scss']
})
export class SubscriptionFormComponent {
  SubscriptionForm: FormGroup;
  public allComplete: boolean = false;
  public userList: any;
  public modules: any[] = [];
  public pachageId: string;
  reportList : any[]=[];
  public allModule:any;
  id: string = '';
  isSubmitting : boolean = false

constructor(private router: Router, private route: ActivatedRoute, private activeRoute: ActivatedRoute, private _commonService: CommonService,private formBuilder: FormBuilder,){
  this.SubscriptionForm = this.buildForm();
}

buildForm() {
  return this.formBuilder.group({
    name: ['', [Validators.required]],
    price:['', [Validators.required]],
    allowUser:['', [Validators.required]]
  });
}

ngOnInit(){
  this.id = this.activeRoute.snapshot.params['id'] ?? '';
  this.route.params.subscribe(async (params) => {
    this.pachageId = this.pachageId ?? params['id']
  })
  this.getAllModule();
  
}

public getAllModule() {
  this._commonService.get('Modules/ModulesByModuleType').subscribe((res) => {
    this.allModule=res?.modules;
    if (res) {
      this.modules = res?.map(x => {
        x.completed = false;
        return x;
      });
      if(this.pachageId) this.getBypackage();
    }
  }, (err) => {
  })
}

  onList() {
    this.router.navigate(['/subscription'])
  }

  SaveAddPackage(){
    if(this.isSubmitting){
      return
    }
    this.isSubmitting = true
    if (this.SubscriptionForm.invalid) {
      this.SubscriptionForm.markAllAsTouched();
      return;
    }
    let selectedModule =[];
     this.modules?.filter(x => x.modules?.some(t=>t.completed)).map(x=>{
      x.modules=x.modules.filter(t=>t.completed)
      return x
    }).forEach(x=>{
      x.modules.forEach(m=>{
        selectedModule.push({moduleId:m.id})
      })
    })
    let payload = { ...this.SubscriptionForm.value,
      allowUser:+this.SubscriptionForm.value.allowUser,
      packageModules:selectedModule
    };
    if (this.pachageId) {
      payload = {
        ...payload,
        id: this.pachageId,
      }
      this._commonService.put('Package', payload).subscribe(res => {
        this._commonService.showToast('Package updated successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.onList();
      })
    } else {
    this._commonService.post(`Package`,payload).subscribe(res => {
      if(res){
        this._commonService.showToast('Package added successfully!', ToastType.SUCCESS, ToastType.SUCCESS);
        this.isSubmitting = false
        this.router.navigate(['subscription']);
      }     
    })
  }
  }

  getBypackage() {
    this._commonService.get(`Package/${this.pachageId}`).subscribe(res => {
      if (res) {
        if(this.modules?.length){
          this.modules = this.modules?.map(x => {
            x.modules = x.modules.map(m=>{
              m.completed=res?.packageModules?.some(pm => m.id == pm.moduleId)
            return m
          });
            return x;
          })
          
          this.allComplete = this.modules?.every(x=>x.completed)       
        }
        this.SubscriptionForm.patchValue(res);
      }
    })
  }

  someComplete(){}

  selectAll(event){
    this.allComplete = event;
    this.modules = this.modules?.map(x=>{
      x.modules?.map(x=>x.completed=event)
      return x;
    })
  }

  onChange(event,pi,i){
    this.modules[pi].modules[i]['completed'] = event;
    this.allComplete = this.modules?.every(x=> x.modules?.every(x=>x.completed))
  }
   partiallyComplete():boolean {
    const task = this.modules;
    return task.some(t => t.modules?.some(x=>x.completed)) && !this.allComplete;
  };

  Allmodule(){
    this._commonService.get(`PackageModule`).subscribe(res => {
    })
  }

  trimNameOnBlur(controlName: string) {
    const control = this.SubscriptionForm.get(controlName);
    if (control?.value) {
      let value = control.value.trim(); // Sanitize & trim
      control.setValue(value, { emitEvent: false });
    }
  }
}
