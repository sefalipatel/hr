// Angular import
import { Component, Input } from '@angular/core';

// Project import
import { NavigationItem } from '../../navigation';
import { log } from 'node:console';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  // public props
  @Input() item!: NavigationItem;

  // public method
  closeOtherMenu(event) {
    const ele = event.target;
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      const sections = document.querySelectorAll('.coded-hasmenu');
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
        sections[i].classList.remove('coded-trigger');
      }
      if (parent.classList.contains('coded-hasmenu')) {
        parent.classList.add('coded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('coded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('coded-trigger');
        last_parent.classList.add('active');
      }
    }
    if ((document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.contains('mob-open')) {
      (document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.remove('mob-open');
    }
  }

  checkModuleAccess(module) {
    
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    let isDisplay = false;
    let role = localStorage.getItem('roleName');

    if (module.type == 'collapse') {
      module?.children.map((submenu) => {
        userPermissions?.accessPermission?.map((item) => {
          const subModuleTitle = submenu?.menuValue.toLowerCase();//.replace(/[\W_]+/g, '');
          const itemTitle = item?.module?.module.toLowerCase();//.replace(/[\W_]+/g, '');
          if (subModuleTitle == '') {
            isDisplay = true;
          } else {
            if (subModuleTitle == itemTitle) {
              if (item.canAdd || item.canDelete || item.canEdit || item.canView) {
                isDisplay = true;
              }
            }
          } 
        });
      });
      return isDisplay;
    } else {
      userPermissions?.accessPermission?.map((item) => {
        const moduleTitle = module.menuValue.toLowerCase();//.replace(/[\W_]+/g, '');
        const itemTitle = item?.module?.module.toLowerCase();//.replace(/[\W_]+/g, '');
       
        if (moduleTitle == '') {
          
          
          isDisplay = true;
        } else {
          if (moduleTitle == itemTitle) {
            if (item.canView) {
              isDisplay = true;
            }
          }
        }
      });
      return isDisplay;
    }
  }
}
