import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/service/common/common.service';
import { TreeGroupCardComponent } from './tree-group-card/tree-group-card.component';
import { TreeItemCardComponent } from './tree-item-card/tree-item-card.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-treeview',
  standalone: true,
  imports: [CommonModule, TreeGroupCardComponent, TreeItemCardComponent],
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent {
  employeeTree: any[] = [];
  employeeList: any[] = [];
  orgEmployeeList: any[] = [];
  dummyList: any[] = [];
  public maxCount: number = 0
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  public defaultImg: string = 'assets/images/tree-view/5.png';
  public organizationId: string;
  favIcon: string = '';
  orgTitle: string = '';

  constructor(
    private apiService: ApiService,
    private _commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.getOrgEmployee();

    this._commonService.favIcon$.subscribe((newFavicon) => {
      if (newFavicon) {
        this.favIcon = this.imageUrl + newFavicon;
      }
    });

    // Load from localStorage 
    const savedFavicon = localStorage.getItem('favIcon');
    if (savedFavicon) {
      this.favIcon = this.imageUrl + savedFavicon;
    }

    this._commonService.title$.subscribe((orgtitle) => {
      if (orgtitle) {
        this.orgTitle = orgtitle
      }
    })

    const orgName = localStorage.getItem('title');
    if (orgName) {
      this.orgTitle = orgName
    }
  }

  getcomapnyprofile() {
    this.apiService.getEmployeeList().then((data) => {
      this.employeeTree = data
    });
  }

  getOrgEmployee() {
    this._commonService.get(`Person/GetByEmployeeForStructure`).subscribe(res => {
      this.employeeList = res;

      let newfilteredEmpList = this.employeeList.map(emp => {
        emp['children'] = this.employeeList.filter(e => e.reportingPersonId == emp.id) ?? [];
        return emp;
      })
      this.data.Org.children = newfilteredEmpList.filter(x => x?.designationLevel == 1 && !x?.reportingPersonId);
    })
  }

  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
  public dataOld = {
    Parent: {
      img: 'father.png',
      name: 'Jan Doe',
      age: '50',
      children: [
        {
          img: 'child_1.png',
          name: 'child 1',
          age: '25',
          grandChild: [
            {
              img: 'child_3.png',
              name: 'grand child 1',
              age: '12',
              grandgrandChild: [
                {
                  img: 'child_6.png',
                  name: 'great grand child 1',
                  age: '13'
                }
              ]
            }
          ]
        },
        {
          img: 'child_2.png',
          name: 'child 2',
          age: '22',
          grandChild: [
            {
              img: 'child_3.png',
              name: 'grand child 1',
              age: '12',
              grandgrandChild: [

              ]
            }
          ]
        },
        {
          img: 'child_4.png',
          name: 'child 3',
          age: '16',
          grandChild: [
            {
              img: 'child_5.png',
              name: 'grand child 1',
              age: '18',
              grandgrandChild: [
                {
                  img: 'child_6.png',
                  name: 'great grand child 1',
                  age: '13'
                },
                {
                  img: 'child_7.png',
                  name: 'great grand child 2',
                  age: '10'
                }
              ]
            }
          ]
        }
      ]
    }
  };
  public data: any = {
    Org: {
      children: [
        {
          img: 'child_1.png',
          name: 'child 1',
          age: '25',
          grandChild: [
            {
              img: 'child_3.png',
              name: 'grand child 1',
              age: '12',
              grandgrandChild: [
                {
                  img: 'child_6.png',
                  name: 'great grand child 1',
                  age: '13'
                }
              ]
            }
          ]
        },
        {
          img: 'child_2.png',
          name: 'child 2',
          age: '22',
          grandChild: [
            {
              img: 'child_3.png',
              name: 'grand child 1',
              age: '12',
              grandgrandChild: [

              ]
            }
          ]
        },
        {
          img: 'child_4.png',
          name: 'child 3',
          age: '16',
          grandChild: [
            {
              img: 'child_5.png',
              name: 'grand child 1',
              age: '18',
              grandgrandChild: [
                {
                  img: 'child_6.png',
                  name: 'great grand child 1',
                  age: '13'
                },
                {
                  img: 'child_7.png',
                  name: 'great grand child 2',
                  age: '10'
                }
              ]
            }
          ]
        }
      ]
    }
  };

  onList() {
    this.route.params.subscribe((params) => {
      this.organizationId = params['id'];
    })
    if (this.organizationId) {
      this.router.navigate(['organization-details']);
    } else {
      this.router.navigate(['user-profile']);
    }
  }

}