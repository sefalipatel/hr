import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-apply-leave-by-user',
  standalone: true,
  imports: [MatInputModule, CommonModule, MatButtonModule, MatDialogModule, MatIconModule, MatSidenavModule, MatButtonModule],
  templateUrl: './apply-leave-by-user.component.html',
  styleUrls: ['./apply-leave-by-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplyLeaveByUserComponent {
  dialog: any;
  drawerOpen: boolean;
  drawerVisible: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApplyLeaveByUserComponent>
  ) { }

  closeModal() {
    this.dialogRef.close('Data returned from modal');
  }
  @ViewChild('drawer') drawer!: MatDrawer;

  openDrawer() {
    this.drawer.open();
  } 

}

