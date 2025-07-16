import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import TitlePopUpComponent from '../../pages/title-pop-up/title-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common/common.service';
import { ResignationFormComponent } from "../../pages/resignation-form/resignation-form.component";
@Component({
    selector: 'app-welcome',
    standalone: true,
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    imports: [
        CommonModule,
        SharedModule,
        NgbNavModule,
        MatCardModule,
        MatButtonModule,
        MatTabsModule,
        MatRippleModule,
        MatDividerModule,
        ResignationFormComponent
    ]
})
export default class WelcomeComponent implements OnInit, OnDestroy {
  details: any;
  userInfo: any;
  constructor(private router: Router, public dialog: MatDialog, private api: CommonService) { }

  today = new Date()
  totalhours = this.today.getHours();
  msg: any;
  hasPopupShown: boolean = false;
  resignationdata : boolean = false;

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.hasPopupShown = localStorage.getItem('popupShown') === 'true';
    if (!this.hasPopupShown) {
      this.api.get(`broadcast/broadcast`).subscribe((x) => {
        if (x?.length) {
          const Details = x;
          const dialogRef = this.dialog.open(TitlePopUpComponent, {
            data: { Details },

            width: '800px' 
          });
          dialogRef.afterClosed().subscribe((result) => {
            dialogRef.close();
          });
        } else {
          this.dialog.closeAll();
        }
      });
    }
    this.hasPopupShown = true;
    localStorage.setItem('popupShown', 'true');
    if (this.totalhours < 12) {
      this.msg = 'Good Morning'
    } else if (this.totalhours < 18) {
      this.msg = 'Good Afternoon'
    } else {
      this.msg = 'Good Evening'
    }
  }

  ngOnDestroy(): void {
    this.dialog.closeAll()
  }
  name = JSON.parse(localStorage.getItem('userInfo'))?.name;

  active = 1;

  btnClick = function () {
    this.router.navigateByUrl('/home/time-card');
  };

  stringToColor(string: any) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return string?.length ? color : '#bfbfbf';
  }
  resignation(){
   this.resignationdata = true;
  }

}
