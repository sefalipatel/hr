import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { SweetalertService } from '../../role-list/sweetalert.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTableModule, RouterModule],
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactInfoComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  dateFormat: string = localStorage.getItem('Date_Format');
  displayedColumns: string[] = ['employeeName', 'phoneNumber', 'email', 'description', 'actions'];
  public contactInfromation: any;
  public searchDataValue = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = false

  constructor(private _commonService: CommonService, private router: Router, private sweetlalert: SweetalertService) { }

  ngOnInit(): void {
    this.getContactData();
  }

  getContactData() {
    this.loading = true
    this._commonService.get(`Contact`).subscribe(res => {
      this.loading = false
      this.contactInfromation = res;
      this.dataSource = new MatTableDataSource<any>(this.contactInfromation);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  searchData(value) {

  }

  editContact(id) {
    this.router.navigate([`contact/form/${id}`])
  }

  async deleteContact(id) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Contact?id=${id}`).subscribe(res => {
        if (res == true) {
          this._commonService.showToast('Contact deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getContactData();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
}
