import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import html2pdf from 'html2pdf.js';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { CompanypolicymodalComponent } from '../companypolicymodal/companypolicymodal.component';
import { saveAs } from 'file-saver';
import { MaterialModule } from 'src/app/theme/shared/material.module';
import { LoaderComponent } from "../../../loader/loader.component";

@Component({
  selector: 'app-companypolicytypelist',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatExpansionModule, MatCheckboxModule, MatDialogModule, MaterialModule, LoaderComponent],
  templateUrl: './companypolicytypelist.component.html',
  styleUrls: ['./companypolicytypelist.component.scss']
})
export class CompanypolicytypelistComponent {
  isAccordionOpen: boolean[] = [];
  companypolicytypeList: any[] = [];
  popup: boolean = false;
  isButtonVisible = true;
  loading: boolean = false;
  isMulti: boolean = false;
  IsPolicyConcern:string;
  name = 'Angular';
  private dialofRef: any;
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  @ViewChild('accordion',{static:true}) accordion: MatAccordion;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private _commonService: CommonService,
    private apiService: ApiService,
    public dialog: MatDialog,

    private route: Router
  ) {
    this.companypolicylist();
  }
  scrollToButtom() {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 500);
  }
  openDialog() {
    return this.dialog.open(CompanypolicymodalComponent, {
      height:'500px',
      maxWidth: '50vw',
      disableClose:true,
      panelClass: 'company-policy-modal'
    });
  }
  
  ngOnInit(): void {
    this.isButtonVisible =  JSON.parse(localStorage.getItem('userRole')).isPolicyConsent
    ; 
    this.scrollToButtom();
    if(this.isButtonVisible == false || this.isButtonVisible == null )
      {
      this.dialofRef = this.openDialog();
    } 
  }
  companypolicylist()
  {
    this.loading = true
    if (this.isButtonVisible == false || this.isButtonVisible == null )
     
      {
        this.apiService.getcompanypolicylistbyperson().then((data) => {
          this.loading = false
          this.companypolicytypeList = data;
        });
      }
      else
      {
        this.apiService.getcompanypolicytypelist().then((data) => {
          this.loading = false
          this.companypolicytypeList = data;
        });
      }
  }
  updatePolicyConcern(data) { 
   let id=JSON.parse(localStorage.getItem('userInfo')).personID
      this._commonService.put('Person/'+ id + '/isPolicyConcern/'+data,{}).subscribe((res) => {
        if (res) {
          this._commonService.showToast('Policy updated successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.isButtonVisible= false;
          let userDetail = JSON.parse(localStorage.getItem('userRole'));
          userDetail.isPolicyConsent = true;
          
          localStorage.setItem('userRole',userDetail);
          this.dialofRef.close();
          this.router.navigate(['home']);
        } 
        else {
          this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, 
      (err) => {
        this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
      })
    }

    public downloadPDF(): void {
      this.loading = true;
      this.isMulti = true;
      this.panels.forEach(panel => {
        panel.expanded = true;
      });
  
      setTimeout(() => {
        const contentElement = this.content.nativeElement;
        const options = {
          filename: 'CompanyPolicy.pdf',
          format: 'a4',
          orientation: 'landscape',
          margin: 10,
          html2canvas: { scale: 3 }
        };
        html2pdf().set(options).from(contentElement).save();
      }, 100); 
      
      setTimeout(() => {
        this.loading = false;
        this.isMulti = false;
        this.accordion.closeAll();
      }, 1000)
    }
    
}
