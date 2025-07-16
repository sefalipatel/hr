import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-bulk-document',
  standalone: true,
  imports: [CommonModule,SharedModule,MatTableModule],
  templateUrl: './bulk-document.component.html',
  styleUrls: ['./bulk-document.component.scss']
})
export class BulkDocumentComponent {
  attachmentUrl: string = environment.apiUrl.replace('api/', '')
  dataSource = new MatTableDataSource<DocumentData>();
  displayedColumns = ['documentName','actions']
  bulkDocument:any;


  constructor(private api: CommonService){}

  ngOnInit(){
    this.getAllbulkDocument();
  }


  downloadFile(text) {
    saveAs(this.attachmentUrl + text.documentPath?.replace('wwwroot\\', ''), text.documentPath?.replace('wwwroot\\', '') );
  };

  getAllbulkDocument(){
    let personId = JSON.parse(localStorage.getItem('userInfo'))?.personID;
    this.api.get(`BulkDocuments/${personId}/documents`).subscribe(res=>{
      this.dataSource.data = res;      
    })
  }
}

export interface DocumentData {
  documentName?: string,
  id?: string
}