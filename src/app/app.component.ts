// angular import
import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from './service/common/common.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from './service/loader.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dyanamic: any
  userInfo: any;
  @Input('app-org-container') inData: any;
  // public props
  title = 'skytus-hr';
  isLoading = false;
  imageUrl: string = environment.apiUrl.replace('api/', '');

  constructor(private commonService: CommonService, public dialog: MatDialog,public router: Router, public loaderService: LoaderService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (event instanceof NavigationEnd) {
        this.loaderService.hide();
      }
    });
  }
  hasPopupShown: boolean = false;
  ngOnInit(): void {
    this.loaderService.loaderState.subscribe(state => {
      this.isLoading = state;
    });

    this.commonService.favIcon$.subscribe((newFavicon) => {
      if (newFavicon) {
        this.updateFavicon(newFavicon);
      }
    });

    // Load from localStorage 
    const savedFavicon = localStorage.getItem('favIcon');
    if (savedFavicon) {
      this.updateFavicon(savedFavicon);
    }
  }

  updateFavicon(faviconUrl: string): void {
    const link: HTMLLinkElement = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = this.imageUrl + faviconUrl;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = this.imageUrl + faviconUrl;
      document.head.appendChild(newLink);
    }
  }
}