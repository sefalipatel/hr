import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { LoaderComponent } from "../../../loader/loader.component";

@Component({
  selector: 'app-time-card',
  imports: [CommonModule, SharedModule, MatCardModule, MatDividerModule],
  standalone: true,
  templateUrl: './time-card.component.html',
  styleUrls: ['./time-card.component.scss']
})
export default class TimeCardComponent {
  constructor(
    private router: Router,
    private _location: Location
  ) { }

  exisitingcard = function () {
    this.router.navigateByUrl('/home/existing-card');
  };
  currenttimecard() {
    this.router.navigateByUrl('/home/addnew-card');
  }

  backClicked() {
    this.router.navigateByUrl('home');
  }
}
