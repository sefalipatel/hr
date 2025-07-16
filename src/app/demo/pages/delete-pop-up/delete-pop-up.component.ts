import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-delete-pop-up',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './delete-pop-up.component.html',
  styleUrls: ['./delete-pop-up.component.scss']
})
export default class DeletePopUpComponent {
  name: string;
  animal: string;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DeletePopUpComponent>
  ) {}

  confirmDelete() {
    this.dialogRef.close('yes');
  }
  cancelDelete() {
    this.dialogRef.close('no');
  }
}
