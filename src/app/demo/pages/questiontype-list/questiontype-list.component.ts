import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { CommonService } from 'src/app/service/common/common.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { userRole } from 'src/app/assets.model';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule , MatPaginator} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { ToastType } from '../../models/models';
import { SharedModule } from 'src/app/theme/shared/shared.module';
export interface questionlist {
  question: string;
  department: string;
}
@Component({
  selector: 'app-questiontype-list',
  standalone: true,
  imports:  [CommonModule,MatPaginatorModule,MatSortModule,MatProgressSpinnerModule,MatTableModule,MatSlideToggleModule
    , SharedModule],
  templateUrl: './questiontype-list.component.html',
  styleUrls: ['./questiontype-list.component.scss']
})
export class QuestiontypeListComponent {
  constructor(private router: Router,
    private sweetlalert: SweetalertService,
    private _commonService: CommonService,){

  }
  public tableData: Array<questionlist> = [];
  public userRole: Array<userRole> = [];
  type: string = '';
  dataSource = new MatTableDataSource<questionlist>();
  public sortConfig!: Sort
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] =  ['question','questionType','department','isActive','actions'];
  loading:boolean=false
  async ngOnInit() {
    this.getAllquestion();
  }
  addquetion(){
    this.router.navigate(['quetion/quetion-form'])
  }
  editquestion(id?: string){
    this.router.navigate([`quetion/quetion-form/${id}`]);
  }
  getAllquestion() {
    this.loading = true;
    this._commonService.get(`Question`).subscribe(res => { 
      this.dataSource = new MatTableDataSource<any>(res);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.tableData = res;
      this.loading = false;
    })
  }
  async deleteBtn(row) {
    this.sweetlalert.deleteBtn();
    const confirmed = await this.sweetlalert.showDeleteConfirmation();
    if (confirmed) {
      this._commonService.delete(`Question/${row.id}`).subscribe(res => {
        if (res?.statusCode == 200 || !res) {
          this._commonService.showToast('Question deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
          this.getAllquestion();
        } else if (res?.statusCode == 400 || !res) {
          this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
        }
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
