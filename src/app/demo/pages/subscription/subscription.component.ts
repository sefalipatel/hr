import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../role-list/sweetalert.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule,MatTableModule,MatProgressSpinnerModule, MatSortModule, MatPaginatorModule, SharedModule, RouterModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'price','allowUser','actions']
  public packgeList : any;
  loading : boolean = false

  constructor(private _commonService: CommonService,private router: Router,private sweetlalert: SweetalertService,){}


  ngOnInit(){
    this.AllPackage();
  }


  AllPackage(){
    this.loading = true
    this._commonService.get(`Package`).subscribe(res => {
      this.loading = false
      this.packgeList=res;  
      this.dataSource = new MatTableDataSource<any>(this.packgeList);   
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  edit(id) {
    this.router.navigate([`subscription-form/${id}`]);
  }

  async delete(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Package/${element}`).subscribe((res) => {
        this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
        this.AllPackage();
        this._commonService.showToast(res?.value, ToastType.SUCCESS, ToastType.SUCCESS);
      }, (err) => {
        this._commonService.showToast('Something Went Wrong', ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data;
    }
  }
}
