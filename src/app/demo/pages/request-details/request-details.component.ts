import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA,  } from '@angular/material/dialog';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export  default class RequestDetailsComponent {

  constructor(
    public dialogRef: MatDialogRef<RequestDetailsComponent> ,
    @Inject (MAT_DIALOG_DATA) public data: {  id:string ,dataSource:any}
  )
  {
  }

  cancelPopup(){
  }

  ngOnInit(){
  
  }
}
