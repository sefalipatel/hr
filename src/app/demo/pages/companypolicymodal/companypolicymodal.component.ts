import { Component,ElementRef,Inject,OnInit,ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import html2pdf from 'html2pdf.js';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { LoaderComponent } from "../../../loader/loader.component";
@Component({
  selector: 'app-companypolicymodal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatCheckboxModule, MatExpansionModule, SharedModule, LoaderComponent],
  templateUrl: './companypolicymodal.component.html',
  styleUrls: ['./companypolicymodal.component.scss']
})
export class CompanypolicymodalComponent {
  isButtonVisible = true;
  isAccordionOpen: boolean[] = [];
  companypolicytypeList: any[] = [];
  @ViewChild('content', { static: false }) content: ElementRef;
  loading: boolean = false;
  constructor( 
    private router: Router,
    private _commonService: CommonService,
    private apiService: ApiService, 
   
    private route: Router,
    public dialog: MatDialogRef<CompanypolicymodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isButtonVisible =  JSON.parse(localStorage.getItem('userRole')).isPolicyConsent;
      this.companypolicylist();
  } 

  companypolicylist() {
    this.loading = true; 
    if (this.isButtonVisible == false || this.isButtonVisible == null) {
      this.apiService.getcompanypolicylistbyperson().then((data) => {
        this.companypolicytypeList = data;
        this.loading = false;
      }).catch((error) => {
        this.loading = false; 
        this._commonService.showToast('Failed to load company policy', ToastType.ERROR, ToastType.ERROR);
      });
    } else {
      this.apiService.getcompanypolicytypelist().then((data) => {
        this.companypolicytypeList = data;
        this.loading = false; 
      }).catch((error) => {
        this.loading = false; 
        this._commonService.showToast('Failed to load company policy', ToastType.ERROR, ToastType.ERROR);
      });
    }
  }
  

  updatePolicyConcern(data) { 
    let id=JSON.parse(localStorage.getItem('userInfo')).personID
       this._commonService.put('Person/'+ id + '/isPolicyConsent/'+data,{}).subscribe((res) => {
         if (res) {
           this._commonService
           this.isButtonVisible= false
           let userDetail = JSON.parse(localStorage.getItem('userRole'));
           userDetail.isPolicyConsent = true;
           localStorage.setItem('userRole',JSON.stringify(userDetail));
           this.dialog.close();
           this.router.navigate(['dashboard']);
         } 
         else {
           this._commonService.showToast(res?.errors[0]?.errorMessage, ToastType.ERROR, ToastType.ERROR)
         }
       }, 
       (err) => {
         this._commonService.showToast('Something went wrong', ToastType.ERROR, ToastType.ERROR)
       })
     }
     public downloadPDF() { 
      const content = this.content.nativeElement;
  
      // Additional options for PDF generation
      const options = {
        filename: 'CompanyPolicy.pdf',
        format: 'a4', // Set the page size to A4
        orientation: 'landscape', // Set the page orientation to landscape
        margin: 10 // Set the page margins
      };
  
      // Generate PDF from HTML content with options
      html2pdf().set(options).from(content).save();
    }
  
}
