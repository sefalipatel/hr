import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { Role, RolePermission, ToastType } from 'src/app/service/common/common.model';
import { CommonService } from 'src/app/service/common/common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { userRole } from 'src/app/assets.model';
export interface permission {
  id?: string
  canAdd?: boolean
  canDelete?: boolean
  canEdit?: boolean
  canView?: boolean
  moduleId?: string
  roleId?: string
  module?: any
  moduleType?: any
  moduleTypeName?: any
}

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatCheckboxModule, MatTableModule, CommonModule, MatPaginatorModule, MatSelectModule, ReactiveFormsModule, FormsModule],
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export default class PermissionComponent implements OnInit {

  public permisssionList: permission[] = [
    {
      moduleTypeName: "Functional",
      module: [{
        name: 'Organization',
        canAdd: true,
        canDelete: true,
        canEdit: true,
        canView: true
      },
      {
        name: 'UserProfile',
        canAdd: true,
        canDelete: true,
        canEdit: true,
        canView: true
      },
      {
        name: 'Holiday',
        canAdd: true,
        canDelete: true,
        canEdit: true,
        canView: true
      },
      {
        name: 'Employee',
        canAdd: true,
        canDelete: true,
        canEdit: true,
        canView: true
      },
      ]
    },
    {
      moduleTypeName: "Reports",
      module: [{
        name: 'ExpenseReport',
        canAdd: true,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'Attendence',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'Timesheet',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'Payslip',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'Gratuity',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: false
      },
      ]
    },
    {
      moduleTypeName: "SystemSettings",
      module: [{
        name: 'Template',
        canAdd: true,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'Permission',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'EmailSettings',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: false
      },
      {
        name: 'CompanyPolicy',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      {
        name: 'GeneralSettings',
        canAdd: false,
        canDelete: false,
        canEdit: false,
        canView: true
      },
      ]
    },
  ];
  public moduleTypeName: string = ''
  public permission: RolePermission[] = [];
  public commonSelect = false;
  public roles: Role[] = [];
  public userRole: Array<userRole> = [];
  public allComplete: boolean = false;
  public roleId: string = '';
  public userId: string = '';
  public functionalList: Array<any> = [];
  public reportsList: Array<any> = [];
  public systemSettingList: Array<any> = [];
  public userList: any;
  public personId: string;

  constructor(private _commonService: CommonService) { }

  ngOnInit(): void {
    this.getAllRoles();
    let userPermissions = JSON.parse(localStorage.getItem('userRole'));
    if (userPermissions?.accessPermission?.length) {
      this.userRole = userPermissions?.accessPermission?.filter(item => {
        return item?.module?.module === "Permission";
      })
    }

    this.permisssionList.map(x => {
      this.moduleTypeName = x.moduleTypeName
    })

    this.functionalList = [this.permisssionList[0]]
    this.reportsList = this.permisssionList[1].module;
    this.systemSettingList = this.permisssionList[2].module;

  }

  public getAllRoles() {
    let orgId = localStorage.getItem('orgId')
    this.roles = [];
    this._commonService.get('Roles/RoleByOrgId' + `/${orgId}`).subscribe((res) => {
      if (res?.statusCode == 200) {
        this.roles = res?.value;
      }
    }, (err) => {
    })
  }

  public roleChange(data: any) {
    const userId = '' ?? this.userId;
    this.allComplete = false;
    if (data?.value) {
      this._commonService.get(`Person/GetPersonByRoleId/${data?.value}`).subscribe(res => {
        this.userList = res;
      })
      this._commonService.get(`Roles/permission?roleId=${this.roleId}&personId=${userId}`).subscribe((res) => {
        this.permission = res ?? [];
        this.permission = this.permission.map(x => {
          x.permissions.sort((a, b) => {
            const moduleA = a.moduleName.toUpperCase();
            const moduleB = b.moduleName.toUpperCase();

            if (moduleA < moduleB) {
              return -1;
            }
            if (moduleA > moduleB) {
              return 1;
            }
            return 0;
          });
          return x;
        })
        this.allComplete = this.permission.every((f) => (((f.permissions.every(x => ((x.canView))))))) && this.permission.some((f) => ((f.typeName == "Functional" && (f.permissions.every(x => ((x.canView)))))));
      }, (err) => {
      })
    }
  }

  public someComplete() {
    return this.permission.some(x => x.canView || x.canAdd || x.canEdit || x.canDelete) && !this.allComplete;
  }

  public someCompleteNew() {
    return this.permission.some(x => x.permissions.some(p => p.canView || p.canAdd || p.canEdit || p.canDelete)) && !this.allComplete;
  } 
  public selectAllNew(completed: boolean) {
    this.allComplete = completed;
    this.permission.forEach(t => {
      if (t.typeName == "Functional") {
        t.permissions.forEach(p => {
          p.canView = completed;
          p.canAdd = completed;
          p.canEdit = completed;
          p.canDelete = completed;
        });
      } else {
        t.permissions.forEach(p => {
          if (!completed) {
            p.canView = completed;
            p.canAdd = completed;
            p.canEdit = completed;
            p.canDelete = completed;
          } else {
            p.canView = completed;
          }
        });
      }
    });
  }

  public selectOne(editpermission: number, status: boolean): void {
    if (status === false) {
      this.permission[editpermission].canView = true;
      this.permission[editpermission].canAdd = true;
      this.permission[editpermission].canEdit = true;
      this.permission[editpermission].canDelete = true;
    } else if (status === true) {
      this.permission[editpermission].canView = false;
      this.permission[editpermission].canAdd = false;
      this.permission[editpermission].canEdit = false;
      this.permission[editpermission].canDelete = false;
    }
  }

  // Manage checkbox functionality
  permissionUpdate(permission) {
    this.allComplete = this.permission.every((f) => (((f.permissions.every(x => ((x.canView))))))) && this.permission.some((f) => ((f.typeName == "Functional" && (f.permissions.every(x => ((x.canView)))))));
    this.permission = this.permission.map(item => {
      if ((item.canDelete || item.canAdd || item.canEdit) && (permission != 'canView')) {
        item.canView = true;
      } else {
        if (!item.canView) {
          item.canDelete = false
          item.canAdd = false
          item.canEdit = false
          item.canView = false
        }
      }
      return item;
    })
  }

  // Save and update permission
  savePermission() {
    let permissionList = [];
    this.permission.map(x => {
      permissionList = [...permissionList, ...x?.permissions];
    })
    if (this.userId) {
      let payload = {
        id: this.roleId,
        personId: this.userId,
        userPermission: permissionList.map(x => {
          let obj = {
            personId: this.userId,
            moduleId: x.moduleId,
            canAdd: x.canAdd,
            canDelete: x.canDelete,
            canEdit: x.canEdit,
            canView: x.canView
          }
          return obj;
        })
      }
       
      this._commonService.post('Roles/updateRolePermission', payload).subscribe((res) => {
        this._commonService.showToast('Permission successfully changed', ToastType.SUCCESS, ToastType.SUCCESS)
        this.userId ? this.userChange({ value: this.userId }) : this.roleChange({ value: this.roleId }); 
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      })
    } else {
      let payload = {
        id: this.roleId,
        permissions: permissionList.map(x => {
          let obj = {
            moduleId: x.moduleId,
            canAdd: x.canAdd,
            canDelete: x.canDelete,
            canEdit: x.canEdit,
            canView: x.canView
          }
          return obj;
        })
      }
      
      this._commonService.post('Roles/updateRolePermission', payload).subscribe((res) => {
        this._commonService.showToast('Permission changed successfully ', ToastType.SUCCESS, ToastType.SUCCESS)
        this.roleChange({ value: this.roleId });
      }, (err) => {
        this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
      }) 
    }
  }

  userChange(data) {
    this.personId = data?.value;
    if (data?.value) {
      this._commonService.get(`Roles/permission?roleId=${this.roleId}&personId=${this.personId}`).subscribe((res) => {
        this.permission = res ?? [];
        this.permission = this.permission.map(x => {
          x.permissions.sort((a, b) => {
            const moduleA = a.moduleName.toUpperCase();
            const moduleB = b.moduleName.toUpperCase();

            if (moduleA < moduleB) {
              return -1;
            }
            if (moduleA > moduleB) {
              return 1;
            }
            return 0;
          });
          return x;
        })
        this.allComplete = this.permission.every((f) => (((f.permissions.every(x => ((x.canView))))))) && this.permission.some((f) => ((f.typeName == "Functional" && (f.permissions.every(x => ((x.canView)))))));
      }, (err) => {
      })
    }
  }
  clearUserPermission() {
    this._commonService.delete(`UserPermission/DeleteRole/${this.userId}`).subscribe(res => {
      if (res == true) {
        this._commonService.showToast('Permission cleared successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.userChange({ value: this.userId });
        this.userId = '';
      } else {
        this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

}