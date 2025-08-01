// Angular import
import { AfterViewInit, Component, Input } from '@angular/core';

// project import
import { NavigationItem } from '../../navigation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-collapse',
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss']
})
export class NavCollapseComponent implements AfterViewInit {
  // public props
  @Input() item!: NavigationItem;
  windowWidth = window.innerWidth;

  constructor(private _router: Router) {
  }


  ngAfterViewInit(): void {
    this.item['isExpanded'] = this.item?.children?.some(x => this._router.url?.includes(x.url))
  }
  // public method
  navCollapse(e) {
    let parent = e.target;
    parent = parent.parentElement;
    const sections = document.querySelectorAll('.coded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('coded-trigger');
      }
    }

    let first_parent = parent.parentElement;
    let pre_parent = parent.parentElement.parentElement;
    if (first_parent.classList.contains('coded-hasmenu')) {
      do {
        first_parent.classList.add('coded-trigger');
        first_parent = first_parent.parentElement.parentElement.parentElement;
      } while (first_parent.classList.contains('coded-hasmenu'));
    } else if (pre_parent.classList.contains('coded-submenu')) {
      do {
        pre_parent.parentElement.classList.add('coded-trigger');
        pre_parent = pre_parent.parentElement.parentElement.parentElement;
      } while (pre_parent.classList.contains('coded-submenu'));
    }
    parent.classList.toggle('coded-trigger');
  }
}
