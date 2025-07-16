import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-pf-details',
  standalone: true,
  imports: [CommonModule,MatInputModule, MatSelectModule, MatPaginatorModule, MatTableModule, ReactiveFormsModule],
  templateUrl: './pf-details.component.html',
  styleUrls: ['./pf-details.component.scss']
})
export class PfDetailsComponent {

}
