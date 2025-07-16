import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-multiple-file-upload',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule],
  templateUrl: './multiple-file-upload.component.html',
  styleUrls: ['./multiple-file-upload.component.scss']
})
export default class MultipleFileUploadComponent {
  selectedFiles: File[] = [];


  constructor(private api : CommonService){}

  onFileSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      return;
    }
    
    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('Files', this.selectedFiles[i]);
    }
  
    this.api.post(`BulkDocuments/bulkUpload`, formData).subscribe((x)=>{
      if(x.statusCode==200){
        this.api.showToast(x?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }
    });
  
    this.selectedFiles = [];
  }

}
