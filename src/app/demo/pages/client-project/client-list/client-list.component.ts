import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from 'src/app/service/common/common.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; 
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { ToastType } from 'src/app/demo/models/models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from 'src/app/theme/shared/material.module';


@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatTableModule,MaterialModule, MatPaginatorModule,MatProgressSpinnerModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent {



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['clientName', "clientContactNumber", 'clientEmail', 'externalStakeholders', 'actions'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource([]);
  userRole: any;
  loading: boolean = false



  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private api: CommonService,
    private sweetlalert: SweetalertService
  ) { }

  ngOnInit() {
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Projects";
      })
    }
    this.getAllDataClient()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  getAllDataClient() {
    this.loading = true
    this.api.get(`Client`).subscribe((x) => {
      this.loading = false
      this.dataSource.data = x

    })
  }
  addClient() {
    this.router.navigate(['client-list/client'])
  }
  edituser(element) {
    this.router.navigate(['/client-list/client/' + element.id])

  }
  async deleteuser(element) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this.api.delete(`Client/${element}`).subscribe((res) => {
        if (res?.statusCode == 200 || !res) {
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== element.id);
          this.api.showToast('Client deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS);
          this.getAllDataClient()
        } else if (res?.statusCode == 400 || !res) {
          this.api.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this.api.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
      this.dataSource.data
    }

  }
}

export interface PeriodicElement {
  clientContactNumber: string,
  clientEmail: string,
  clientName: string,
  externalStakeholders: string
  id?: string
}
