import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common/common.service';
import { Console } from 'console';

@Component({
  selector: 'app-title-pop-up',
  standalone: true,
  imports: [CommonModule,MatRadioModule,MatCardModule],
  templateUrl: './title-pop-up.component.html',
  styleUrls: ['./title-pop-up.component.scss']
})
export default class TitlePopUpComponent {
  details: any;

  constructor(public dialog: MatDialog,private api:CommonService,  public dialogRef: MatDialogRef<TitlePopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Details:any }){
  }

ngOnInit(){
  
    this.details=this.data.Details
  
 
}
cancelPopup() {
  this.dialogRef.close('Cancel');
}

}
