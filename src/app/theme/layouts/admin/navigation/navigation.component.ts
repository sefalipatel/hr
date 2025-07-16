// Angular import
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Organization } from 'src/app/demo/models/models';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // public props
  @Output() NavCollapsedMob = new EventEmitter();
  windowWidth = window.innerWidth;
  title: string = '';
  favicon: string = '';
  @Input() navCollapsed: boolean;
  @Output() NavCollapse = new EventEmitter();
  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  constructor(private _commonService: CommonService, private _title: Title, private cdr: ChangeDetectorRef) {
    const id = localStorage.getItem('orgId') ?? "";
    if (id)
      this.getOrganizationSetting(id);
  }

  ngOnInit(): void {
    this._commonService.title$.subscribe((newTitle) => {
      this.title = newTitle;
    });

    this.cdr.detectChanges();
  }

  public getOrganizationSetting(id: string) {
    this._commonService.get(`Organizations/${id}`).subscribe((res: Organization | any) => {
      if (res?.value) {
        this.title = res?.value?.title;
        this.favicon = res?.value?.favicon ? environment?.apiUrl?.replace('/api', '') + res?.value?.favicon : this.favicon;

        if (this.title) {
          this._commonService.updateTitle(this.title);
          this._commonService.updateOrgName(res?.value.name);
          this._commonService.updateLogo(res?.value?.logo);
          this._commonService.updateFavicon(res?.value?.favicon);
          localStorage.setItem('title', this.title);
          localStorage.setItem('orgName', res?.value?.name);
          this._title.setTitle(this.title);
        }
      }
    }, (err) => {
      this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR);
    })
  }
  isMenuOpen = false;

  @ViewChild('menu') menuRef!: ElementRef;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.menuRef?.nativeElement.contains(event.target);
    const clickedToggleButton = (event.target as HTMLElement).id === 'mobile-collapse1';
    if (!clickedInside && !clickedToggleButton) {
      this.isMenuOpen = false;
    }
  }

  navCollapse() {
    this.NavCollapse.emit();
  }
}
