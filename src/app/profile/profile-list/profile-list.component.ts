import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone:true,
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileListComponent {

}
