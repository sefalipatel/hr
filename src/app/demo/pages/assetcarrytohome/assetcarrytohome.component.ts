import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from 'src/app/service/common/common.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastType } from 'src/app/demo/models/models';
@Component({
  selector: 'app-assetcarrytohome',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule, MatInputModule,MatDatepickerModule,MatSelectModule,ReactiveFormsModule],
  templateUrl: './assetcarrytohome.component.html',
  styleUrls: ['./assetcarrytohome.component.scss']
})
export class AssetcarrytohomeComponent implements OnInit {
  form: FormGroup
  selectiontype: any;
  @Input() assetList : any[];
  id: string = '';
  @Output() req: EventEmitter<boolean> = new EventEmitter();
  @Output() isAssetAction: EventEmitter<boolean> = new EventEmitter();
  onCancel(){
    this.req.emit(false);
    this.isAssetAction.emit(false);
  }
  @Input() public set requestId(requestId: string){
    this._requestId = requestId;
    if (this._requestId) {
      this.api.get(`Person/${this._requestId}/assetAssignment`).subscribe(
        (response) => {
          this.assetList = response
        },
        (err) => {
        }
      );
    } 
  };
  public get requestId(): string {
    return this._requestId;
  }
  private _requestId!: string;

  @Input() public set isProfile(profile: boolean) {
    this._isProfile = profile;
    if (profile) {
      let requestId = JSON.parse(localStorage.getItem('userInfo')).personID;
      this.api.get(`Person/${requestId}/assetAssignment`).subscribe(
        (response) => {
          this.assetList = response
        },
        (err) => {
        }
      );
    }
  }

  public get isProfile(): boolean {
    return this._isProfile;
  }

  private _isProfile!: boolean;

  constructor(private api: CommonService,private activeRoute: ActivatedRoute,  private formBuilder: FormBuilder,private datePipe:DatePipe,
      private router: Router, 
     private route: ActivatedRoute, 
     private _commonService: CommonService,
     
     ) {
    this.form = this.formBuilder.group({
      AssetsId: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(500)]],
      userId:[JSON.parse(localStorage.getItem('userInfo')).personID]
    })
  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
  }
  selectionChange(data) {
    this.selectiontype = data.value
  }
  addAssetCarry() {
    let isFormValid = true;

    // Trim all form values before checking validity
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control && typeof control.value === 'string') {
        const trimmedValue = control.value.trim();
        control.setValue(trimmedValue || '', { emitEvent: false });
  
        // If any field becomes empty after trimming, mark form as invalid
        if (trimmedValue === '') {
          isFormValid = false;
        }
      }
    });
  
    if (this.form.invalid || !isFormValid) {
      this.form.markAllAsTouched();
      return;
    }
  
    
    const formattedStartDate = this.datePipe.transform(this.form.value.startDate, 'yyyy-MM-ddTHH:mm:ss');
    const formattedEndDate = this.datePipe.transform(this.form.value.endDate, 'yyyy-MM-ddTHH:mm:ss');
    this.form.patchValue({ startDate: formattedStartDate, endDate: formattedEndDate });

    this._commonService.post('AssetCarryToHome/MultipleAddAssetCarryToHome', this.form.value).subscribe((res) => {
      if (res) {
        this._commonService.showToast('Asset carrytohome successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.req.emit(false);
        this.isAssetAction.emit(false);
        if (this.isProfile || this.requestId) {
          this.form.reset();
        } else {
          this.router.navigate(['asset-history'])
        }
      }
      else {
        this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    },
      (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
  }
  onList() {
    if (this.isProfile || this.requestId) {
      this.isAssetAction.emit(false)
      this.form.reset();

    } else {
      this.router.navigate(['asset-history'])
    }
  }
  trimNameOnBlur(controlName: string) {
    const control = this.form.get(controlName);
    if (control?.value) {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}
