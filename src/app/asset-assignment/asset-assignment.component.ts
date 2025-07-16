import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-asset-assignment',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './asset-assignment.component.html',
  styleUrls: ['./asset-assignment.component.scss']
})
export class AssetAssignmentComponent {

}
