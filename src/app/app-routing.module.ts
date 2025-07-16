// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { BrowserUtils } from '@azure/msal-browser';
import { AuthGuard } from './auth.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SalaryManagementModule } from './salary-management/salary-management.module';
import { PaySlipComponent } from './demo/pages/pay-slip/pay-slip.component';
import { CompanypolicyComponent } from './demo/pages/companypolicy/companypolicy.component';
import { CompanypolicydetailsComponent } from './demo/pages/companypolicydetails/companypolicydetails.component';
import { CompanypolicytypelistComponent } from './demo/pages/companypolicytypelist/companypolicytypelist.component';
import { InvoicedetailsComponent } from './demo/pages/invoicedetails/invoicedetails.component';
import { InvoicelistComponent } from './demo/pages/invoicelist/invoicelist.component';
import { MeetingComponent } from './meeting/meeting.component';
import { MeetingFormComponent } from './meeting/meeting-form/meeting-form.component';
import { RoomBookingComponent } from './room-booking/room-booking.component';

import { AssethistorylistComponent } from './demo/pages/assethistorylist/assethistorylist.component';
import { PayRollComponent } from './demo/pages/pay-roll/pay-roll.component';
import { BroadcastFormComponent } from './demo/pages/broadcast-form/broadcast-form.component';
import { BroadcastListComponent } from './demo/pages/broadcast-list/broadcast-list.component';
import { QuestiontypeFormComponent } from './demo/pages/questiontype-form/questiontype-form.component';
import { QuestiontypeListComponent } from './demo/pages/questiontype-list/questiontype-list.component';
import { ReviewMasterComponent } from './demo/pages/review-master/review-master.component';
import { ReviewQuestionComponent } from './demo/pages/review-question/review-question.component';
import { JobinquiryComponent } from './demo/pages/jobinquiry/jobinquiry.component';
import { RoomBookingReportComponent } from './report/room-booking-report/room-booking-report.component';
import { CompanyprofileFormComponent } from './demo/pages/companyprofile-form/companyprofile-form.component';
import { CompanyprofileListComponent } from './demo/pages/companyprofile-list/companyprofile-list.component';
import { AddsuggestionsComponent } from './feedback-suggestions/addsuggestions/addsuggestions.component';
import { ChartComponent } from './demo/pages/chart/chart.component';
import { WarningFormComponent } from './warning-form/warning-form.component';
import { FilterInquiryComponent } from './demo/pages/filter-inquiry/filter-inquiry.component';
import { SalaryEarningComponent } from './salary-management/salary-earning/salary-earning.component';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./landing-page/landing-page.component').then((m) => m.LandingPageComponent)
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard1',
        loadComponent: () => import('./new-dashboard/new-dashboard.component').then((m) => m.NewDashboardComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./new-dashboard2/new-dashboard2.component').then((m) => m.NewDashboard2Component),
        canActivate: [AuthGuard]
      }, 
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
      },
      {
        path: 'card',
        loadComponent: () => import('./demo/component/card/card.component')
      },
      {
        path: 'breadcrumb',
        loadComponent: () => import('./demo/component/breadcrumb/breadcrumb.component')
      },
      {
        path: 'spinner',
        loadComponent: () => import('./demo/component/spinner/spinner.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'default-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadComponent: () => import('./demo/default/welcome/welcome.component')
          },
          {
            path: 'time-card',
            loadComponent: () => import('./demo/pages/time-card/time-card.component')
          },
          {
            path: 'existing-card',
            loadComponent: () => import('./demo/pages/existing-card/existing-card.component')
          },
          {
            path: 'add-time-card',
            loadComponent: () => import('./demo/pages/add-time-card/add-time-card.component')
          },
          {
            path: 'add-time-card/:id',
            loadComponent: () => import('./demo/pages/add-time-card/add-time-card.component')
          },
          {
            path: 'addnew-card',
            loadComponent: () => import('./demo/pages/add-new-card/add-new-card.component')
          }
        ],
        canActivate: [AuthGuard]
      },

      {
        path: 'holiday-details',
        loadComponent: () => import('./demo/default/holiday/holiday.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'HolidayUser',
        loadComponent: () => import('./demo/pages/user-holiday/user-holiday.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'holiday-details/add-holiday',
        loadComponent: () => import('./demo/pages/Holiday-card/holiday-card.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'holiday-details/add-holiday/:id',
        loadComponent: () => import('./demo/pages/Holiday-card/holiday-card.component')
      },
      {
        path: 'leave-details',
        loadComponent: () => import('./demo/pages/userleave-details/userleave-details.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'new-leave-detail',
        loadComponent: () =>
          import('./demo/pages/new-leave-component/new-leave-component.component').then((m) => m.NewLeaveComponentComponent)
      },
      {
        path: 'new-apply-leave',
        loadComponent: () => import('./demo/pages/new-apply-leave/new-apply-leave.component').then((m) => m.NewApplyLeaveComponent)
      },
      {
        path: 'new-apply-leave/:id',
        loadComponent: () => import('./demo/pages/new-apply-leave/new-apply-leave.component').then((m) => m.NewApplyLeaveComponent)
      },
      {
        path: 'leave-report',
        loadComponent: () => import('./demo/pages/leave-report/leave-report.component').then((m) => m.LeaveReportComponent),
        canActivate: [AuthGuard]
      },

      {
        path: 'leave-details/apply-leave',
        loadComponent: () => import('./demo/pages/leave-details/leave-details.component'),
        canActivate: [AuthGuard]
      },

      {
        path: 'leave-details/apply-leave/:id',
        loadComponent: () => import('./demo/pages/leave-details/leave-details.component'),
        canActivate: [AuthGuard]
      },
      {
        path: 'employee-leave-details',
        loadComponent: () => import('./demo/pages/user-leave/user-leave.component'),
        canActivate: [AuthGuard]
      },

      {
        path: 'attendance',
        loadComponent: () => import('./demo/pages/atteandace/atteandace.component'),
        canActivate: [AuthGuard]
      },

      {
        path: 'attendance/:id',
        loadComponent: () => import('./demo/pages/atteandace/atteandace.component'),

        canActivate: [AuthGuard]
      },

      {
        path: 'approvalPopUp',
        loadComponent: () => import('./demo/pages/approvalfrom-pop-up/approvalfrom-pop-up.component'),
        canActivate: [AuthGuard]
      },

      {
        path: 'deletePopUp',
        loadComponent: () => import('./demo/pages/delete-pop-up/delete-pop-up.component')
      },

      {
        path: 'employee-attendance',
        loadComponent: () => import('./demo/pages/admin-attendance-view/admin-attendance-view.component'),
        canActivate: [AuthGuard]
      },

      {
        path: 'missingTime',
        loadComponent: () => import('./demo/pages/missing-time-add/missing-time-add.component')
      },
      {
        path: 'missingTime/:id',
        loadComponent: () => import('./demo/pages/missing-time-add/missing-time-add.component')
      },

      {
        path: 'employee-timeupdate-request',
        loadComponent: () => import('./demo/pages/admine-request-approval/admine-request-approval.component')
      },
      {
        path: 'employee-wfh-compoff',
        loadComponent: () =>
          import('./demo/pages/admin-wfh-compoff-view/admin-wfh-compoff-view.component').then((m) => m.AdminWfhCompoffViewComponent)
      },

      {
        path: 'employee-request-details',
        loadComponent: () => import('./demo/pages/user-request-list/user-request-list.component'),
        canActivate: [AuthGuard]
      },
           {
        path: 'employee-wfh-compoff',
        loadComponent: () => import('./demo/pages/user-compoff-wfh-list/user-compoff-wfh-list.component').then((m)=>m.UserCompoffWfhListComponent),
        // canActivate: [AuthGuard]
      },
      {
        path: 'Reason',
        loadComponent: () => import('./demo/pages/reason-popup/reason-popup.component')
      },
      {
        path: 'employee-details',
        loadComponent: () => import('./demo/pages/Employee/employee-list/employee-list.component')
      },
      {
        path: 'email-setting-details',
        loadComponent: () => import('./demo/pages/email-setting/email-setting.component').then((m) => m.EmailSettingComponent)
      },
      {
        path: 'system-sms-settings',
        loadComponent: () => import('./demo/pages/sms-setting/sms-setting.component').then((m) => m.SmsSettingComponent)
      },
      {
        path: 'change-password',
        loadComponent: () => import('./demo/pages/change-password/change-password.component').then((m) => m.ChangePasswordComponent)
      },
      {
        path: 'employee-details/add-employee',
        loadComponent: () => import('./demo/pages/Employee/add-employee/add-employee.component')
      },
      {
        path: 'employee-details/add-employee/:id',
        loadComponent: () => import('./demo/pages/Employee/add-employee/add-employee.component')
      },
      {
        path: 'employee-details/update-employee/:id',
        loadComponent: () => import('../app/profile/pro-detail/pro-detail.component').then((m) => m.ProDetailComponent)
      },
      {
        path: 'employee-gratuity',
        loadComponent: () => import('./demo/pages/gratuity/gratuity.component').then((m) => m.GratuityComponent)
      },
      {
        path: 'finance',
        loadComponent: () => import('./demo/pages/finance/finance.component').then((m) => m.FinanceComponent)
      },
      {
        path: 'self-review',
        loadComponent: () => import('./demo/pages/self-review/self-review.component').then((m) => m.SelfReviewComponent)
      },
      {
        path: 'subscription-form',
        loadComponent: () => import('./demo/pages/subscription-form/subscription-form.component').then((m) => m.SubscriptionFormComponent)
      },
      {
        path: 'subscription-form/:id',
        loadComponent: () => import('./demo/pages/subscription-form/subscription-form.component').then((m) => m.SubscriptionFormComponent)
      },
      {
        path: 'subscription',
        loadComponent: () => import('./demo/pages/subscription/subscription.component').then((m) => m.SubscriptionComponent)
      },
      {
        path: 'termination-list',
        loadComponent: () => import('./demo/pages/termination-list/termination-list.component').then((m) => m.TerminationListComponent)
      },
      {
        path: 'termination-form',
        loadComponent: () => import('./demo/pages/termination-form/termination-form.component').then((m) => m.TerminationFormComponent)
      },
      {
        path: 'annual-report',
        loadComponent: () => import('./demo/pages/annual-report/annual-report.component').then((m) => m.AnnualReportComponent)
      },
      {
        path: 'resignation-list',
        loadComponent: () => import('./demo/pages/resignation-list/resignation-list.component').then((m) => m.ResignationListComponent)
      },
      {
        path: 'resignation-form',
        loadComponent: () => import('./demo/pages/resignation-form/resignation-form.component').then((m) => m.ResignationFormComponent)
      },
      {
        path: 'bonus-master-list',
        loadComponent: () => import('./demo/pages/bonus-master-list/bonus-master-list.component').then((m) => m.BonusMasterListComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'bonus-master-list/addBonus',
        loadComponent: () => import('./demo/pages/bonus-master-list/add-bonus/add-bonus.component').then((m) => m.AddBonusComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'bonus-master-list/addBonus/:id',
        loadComponent: () => import('./demo/pages/bonus-master-list/add-bonus/add-bonus.component').then((m) => m.AddBonusComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'self-review-form/:id',
        loadComponent: () => import('./demo/pages/self-review-form/self-review-form.component').then((m) => m.SelfReviewFormComponent)
      }, 
      {
        path: 'asset-management',
        children: [
          {
            path: '',
            loadComponent: () => import('./asset-management/asset/asset.component').then((m) => m.AssetComponent)
          },
          {
            path: 'add-asset',
            loadComponent: () => import('./asset-management/add-asset/add-asset.component').then((m) => m.AddAssetComponent)
          },
          {
            path: 'add-asset/:id',
            loadComponent: () => import('./asset-management/add-asset/add-asset.component').then((m) => m.AddAssetComponent)
          }
        ]
      },
      {
        path: 'asset-category-details',
        children: [
          {
            path: '',
            loadComponent: () => import('./asset-management/asset-category/asset-category.component').then((m) => m.AssetCategoryComponent)
          },
          {
            path: 'add-asset-category',
            loadComponent: () =>
              import('./asset-management/add-asset-category/add-asset-category.component').then((m) => m.AddAssetCategoryComponent)
          },
          {
            path: 'add-asset-category/:id',
            loadComponent: () =>
              import('./asset-management/add-asset-category/add-asset-category.component').then((m) => m.AddAssetCategoryComponent)
          }
        ]
      }, 
    
      {
        path: 'AssetCategory',
        loadChildren: () => import('./asset-management/asset-management.module').then((m) => m.AssetManagementModule)
      },
      {
        path: 'system-general-settings',
        loadComponent: () => import('./demo/pages/general-setting/general-setting.component')
      }, 
      {
        path: 'system-template-details',
        loadChildren: () => import('./demo/pages/template/template.module').then((m) => m.TemplateModule)
      }, 
      {
        path: 'asset-assign-details',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./asset-assignment/assignment-category/assignment-category.component').then((m) => m.AssignmentCategoryComponent)
          },
          {
            path: 'assign-asset',
            loadComponent: () => import('./asset-assignment/add-assignment-category/add-assignment-category.component')
          },
          {
            path: 'assign-asset/:id',
            loadComponent: () => import('./asset-assignment/add-assignment-category/add-assignment-category.component')
          }
        ]
      },
      {
        path: 'AssetUserAssignment',
        loadComponent: () => import('./asset-user-assignment/asset-user-assignment.component').then((m) => m.AssetUserAssignmentComponent)
      },

      {
        path: 'organization-details',
        loadComponent: () => import('./demo/pages/org-list-container/org-list-container.component').then((m) => m.OrgListContainerComponent)
      },
      {
        path: 'organization-details/add-organization',
        loadComponent: () => import('./demo/pages/org-container/org-container.component').then((m) => m.OrgContainerComponent)
      },
      {
        path: 'organization-details/add-organization/:id',
        loadComponent: () => import('./demo/pages/org-container/org-container.component').then((m) => m.OrgContainerComponent)
      },
      {
        path: 'organization-details/org-subscription/:id',
        loadComponent: () => import('./demo/pages/org-subscription/org-subscription.component').then((m) => m.OrgSubscriptionComponent)
      },
      {
        path: 'organization-details/payment_history',
        loadComponent: () =>
          import('./demo/pages/org-subscription/payment-history/payment-history.component').then((m) => m.PaymentHistoryComponent)
      },
      {
        path: 'user-role-details',
        loadComponent: () => import('./demo/pages/role-list/role-list.component')
      },
      {
        path: 'user-role-permissions',
        loadComponent: () => import('./demo/pages/permission/permission.component')
      },

      {
        path: 'treeView',
        loadComponent: () => import('./demo/pages/treeview/treeview.component').then((m) => m.TreeviewComponent)
      },
      {
        path: 'treeView/:id',
        loadComponent: () => import('./demo/pages/treeview/treeview.component').then((m) => m.TreeviewComponent)
      },
      {
        path: 'project_treeView',
        loadComponent: () =>
          import('./demo/pages/treeview/project-tree-view/project-tree-view.component').then((m) => m.ProjectTreeViewComponent)
      },
      {
        path: 'project_treeView/:id',
        loadComponent: () =>
          import('./demo/pages/treeview/project-tree-view/project-tree-view.component').then((m) => m.ProjectTreeViewComponent)
      },
      {
        path: 'project-details',
        loadChildren: () => import('./project-management/project-management.module').then((m) => m.ProjectManagementModule)
      },
      {
        path: 'user-designation',
        loadComponent: () => import('./demo/pages/designation/designation.component').then((m) => m.DesignationComponent)
      },
      {
        path: 'department',
        loadComponent: () => import('./demo/pages/department/department.component').then((m) => m.DepartmentComponent)
      },
      {
        path: 'employee-loan-details',
        loadComponent: () => import('./demo/pages/loan-list/loan-list.component').then((m) => m.LoanListComponent)
      },
      {
        path: 'employee-loan-details/loan-detail',
        loadComponent: () => import('./demo/pages/loan-form/loan-form.component').then((m) => m.LoanFormComponent)
      },
      {
        path: 'employee-loan-details/loan-detail/:id',
        loadComponent: () => import('./demo/pages/loan-form/loan-form.component').then((m) => m.LoanFormComponent)
      },
      {
        path: 'advance-salary',
        loadComponent: () =>
          import('./demo/pages/advance-salary-list/advance-salary-list.component').then((m) => m.AdvanceSalaryListComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'insurance-master/add-company',
        loadComponent: () => import('./demo/pages/insurance/insurance.component').then((m) => m.InsuranceComponent)
      },
      {
        path: 'insurance-master/add-company/:id',
        loadComponent: () => import('./demo/pages/insurance/insurance.component').then((m) => m.InsuranceComponent)
      },
      {
        path: 'insurance-master',
        loadComponent: () => import('./demo/pages/insurace-list/insurace-list.component').then((m) => m.InsuraceListComponent)
      },
      {
        path: 'employee-insurance-details',
        loadComponent: () =>
          import('./demo/pages/employee-insurance-list/employee-insurance-list.component').then((m) => m.EmployeeInsuranceListComponent)
      },
      {
        path: 'add-employee-insurance',
        loadComponent: () =>
          import('./demo/pages/employee-insurance-form/employee-insurance-form.component').then((m) => m.EmployeeInsuranceFormComponent)
      },
      {
        path: 'user-profile',
        loadComponent: () => import('./demo/pages/change-profile/change-profile.component').then((m) => m.ChangeProfileComponent)
      },
      {
        path: 'add-employee-insurance/:id',
        loadComponent: () =>
          import('./demo/pages/employee-insurance-form/employee-insurance-form.component').then((m) => m.EmployeeInsuranceFormComponent)
      },
      {
        path: 'salary-components-details',
        loadChildren: () => import('./salary-management/salary-management.module').then((m) => m.SalaryManagementModule)
      },
       
      {
        path: 'employee-payslip/:id/:month',
        loadComponent: () => import('./demo/pages/pay-slip/pay-slip.component').then((m) => PaySlipComponent)
      },
      {
        path: 'employee-payslip',
        loadComponent: () => import('./demo/pages/pay-slip/pay-slip.component').then((m) => PaySlipComponent)
      },
      {
        path: 'employee-payroll-add',
        loadComponent: () => import('./salary-management/employee-payroll/employee-payroll.component')
      },
      {
        path: 'company-policy-details/add-company-policy',
        loadComponent: () =>
          import('./demo/pages/companypolicydetails/companypolicydetails.component').then((m) => CompanypolicydetailsComponent)
      },
      {
        path: 'company-policy-details/add-company-policy/:id',
        loadComponent: () =>
          import('./demo/pages/companypolicydetails/companypolicydetails.component').then((m) => CompanypolicydetailsComponent)
      },

      {
        path: 'company-policy-details',
        loadComponent: () => import('./demo/pages/companypolicy/companypolicy.component').then((m) => CompanypolicyComponent)
      },
      {
        path: 'company-policy',
        loadComponent: () =>
          import('./demo/pages/companypolicytypelist/companypolicytypelist.component').then((m) => CompanypolicytypelistComponent)
      },
      {
        path: 'expense-details',
        loadComponent: () => import('./demo/pages/expense-list/expense-list.component').then((m) => m.ExpenseListComponent)
      },
      {
        path: 'expense-claim',
        loadComponent: () => import('./demo/pages/expense-form/expense-form.component').then((m) => m.ExpenseFormComponent)
      },
      {
        path: 'expense-claim/:id',
        loadComponent: () => import('./demo/pages/expense-form/expense-form.component').then((m) => m.ExpenseFormComponent)
      },
      {
        path: 'expense-type-list',
        loadComponent: () => import('./demo/pages/expense-type-list/expense-type-list.component').then((m) => m.ExpenseTypeListComponent)
      },
      {
        path: 'expense-type-form',
        loadComponent: () => import('./demo/pages/expense-type-form/expense-type-form.component').then((m) => m.ExpenseTypeFormComponent)
      },
      {
        path: 'expense-type-form/:id',
        loadComponent: () => import('./demo/pages/expense-type-form/expense-type-form.component').then((m) => m.ExpenseTypeFormComponent)
      },
      {
        path: 'add-invoice',
        loadComponent: () => import('./demo/pages/invoicedetails/invoicedetails.component').then((m) => InvoicedetailsComponent)
      },
      {
        path: 'add-invoice/:id',
        loadComponent: () => import('./demo/pages/invoicedetails/invoicedetails.component').then((m) => InvoicedetailsComponent)
      },
      {
        path: 'invoice-details',
        loadComponent: () => import('./demo/pages/invoicelist/invoicelist.component').then((m) => InvoicelistComponent)
      },
      {
        path: 'organization-details/file-storage-setting',
        loadComponent: () =>
          import('./demo/pages/file-system-setting/file-system-setting.component').then((m) => m.FileSystemSettingComponent)
      },
      {
        path: 'asset-history',
        loadComponent: () => import('./demo/pages/assethistorylist/assethistorylist.component').then((m) => AssethistorylistComponent)
      },
      {
        path: 'pay-roll',
        loadComponent: () => import('./demo/pages/pay-roll/pay-roll.component').then((m) => PayRollComponent)
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/pages/chart/chart.component').then((m) => ChartComponent)
      },
      {
        path: 'employee-payroll-assign',
        loadComponent: () => import('./demo/pages/pay-roll-add/pay-roll-add.component').then((m) => m.PayRollAddComponent)
      },
      {
        path: 'timesheet-details',
        loadComponent: () => import('./demo/pages/time-sheet-admin/time-sheet-admin.component')
      },
      {
        path: 'employee-payroll-details',
        loadComponent: () =>
          import('./salary-management/employee-salary-list/employee-salary-list.component').then((m) => m.EmployeeSalaryListComponent)
      },
      {
        path: 'employee-payroll-details/payroll-form/:id/:month',
        loadComponent: () =>
          import('./salary-management/employee-salary-detail-form/employee-salary-detail-form.component').then(
            (m) => m.EmployeeSalaryDetailFormComponent
          )
      },
      {
        path: 'broadcast/broadcast-form',
        loadComponent: () => import('./demo/pages/broadcast-form/broadcast-form.component').then((m) => BroadcastFormComponent)
      },
      {
        path: 'broadcast/broadcast-form/:id',
        loadComponent: () => import('./demo/pages/broadcast-form/broadcast-form.component').then((m) => BroadcastFormComponent)
      },
      {
        path: 'broadcast',
        loadComponent: () => import('./demo/pages/broadcast-list/broadcast-list.component').then((m) => BroadcastListComponent)
      },
      {
        path: 'employee-review-details',
        loadComponent: () => import('./demo/pages/broadcast-list/broadcast-list.component').then((m) => BroadcastListComponent)
      },
      {
        path: 'employee-review-master-details',
        loadComponent: () => import('./demo/pages/review-master/review-master.component').then((m) => ReviewMasterComponent)
      },
      {
        path: 'employee-review-master-details/admin-review-master-questions',
        loadComponent: () => import('./demo/pages/review-question/review-question.component').then((m) => ReviewQuestionComponent)
      },
      {
        path: 'employee-review-master-details/admin-review-master-questions/:id',
        loadComponent: () => import('./demo/pages/review-question/review-question.component').then((m) => ReviewQuestionComponent)
      },
      {
        path: 'quetion/quetion-form',
        loadComponent: () => import('./demo/pages/questiontype-form/questiontype-form.component').then((m) => QuestiontypeFormComponent)
      },
      {
        path: 'quetion/quetion-form/:id',
        loadComponent: () => import('./demo/pages/questiontype-form/questiontype-form.component').then((m) => QuestiontypeFormComponent)
      },
      {
        path: 'quetion',
        loadComponent: () => import('./demo/pages/questiontype-list/questiontype-list.component').then((m) => QuestiontypeListComponent)
      },
      {
        path: 'jobinquiry',
        loadComponent: () => import('./demo/pages/jobinquiry/jobinquiry.component').then((m) => JobinquiryComponent)
      },
      {
        path: 'filterinquiry',
        loadComponent: () => import('./demo/pages/filter-inquiry/filter-inquiry.component').then((m) => FilterInquiryComponent)
      },
      {
        path: 'organization-setting',
        loadComponent: () =>
          import('./demo/pages/organization-setting-list/organization-setting-list.component').then(
            (m) => m.OrganizationSettingListComponent
          )
      },
      {
        path: 'organization-details/organization-setting-detail',
        loadComponent: () =>
          import('./demo/pages/organization-setting-form/organization-setting-form.component').then(
            (m) => m.OrganizationSettingFormComponent
          )
      },
      {
        path: 'organization-details/organization-setting-detail/:id',
        loadComponent: () =>
          import('./demo/pages/organization-setting-form/organization-setting-form.component').then(
            (m) => m.OrganizationSettingFormComponent
          )
      },
      {
        path: 'appraisal',
        loadComponent: () => import('./demo/pages/appraisal-list/appraisal-list.component').then((m) => m.AppraisalListComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'appraisal/appraisal-detail',
        loadComponent: () => import('./demo/pages/appraisal-form/appraisal-form.component').then((m) => m.AppraisalFormComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'appraisal/appraisal-detail/:id',
        loadComponent: () => import('./demo/pages/appraisal-form/appraisal-form.component').then((m) => m.AppraisalFormComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'employee-bonus-details/:id',
        loadComponent: () => import('./demo/pages/bonus-list/bonus-list.component').then((m) => m.BonusListComponent)
      },
      {
        path: 'multipleDocument',
        loadComponent: () => import('./demo/pages/multiple-file-upload/multiple-file-upload.component')
      },
      {
        path: 'client-list/client',
        loadComponent: () => import('./demo/pages/client-project/client-project.component').then((m) => m.ClientProjectComponent)
      },
      {
        path: 'client-list/client/:id',
        loadComponent: () => import('./demo/pages/client-project/client-project.component').then((m) => m.ClientProjectComponent)
      },
      {
        path: 'client-list',
        loadComponent: () => import('./demo/pages/client-project/client-list/client-list.component').then((m) => m.ClientListComponent)
      },
      {
        path: 'project-task',
        loadComponent: () => import('./demo/pages/Project/project-task/project-task.component').then((m) => m.ProjectTaskComponent)
      },
      {
        path: 'project-dashboard/project-task/:id',
        loadComponent: () => import('./demo/pages/Project/project-task/project-task.component').then((m) => m.ProjectTaskComponent)
      },
      {
        path: 'project-taskboard',
        loadComponent: () =>
          import('./demo/pages/Project/project-taskboard/project-taskboard.component').then((m) => m.ProjectTaskboardComponent)
      }, 
      {
        path: 'project-taskboard/project-sprint-task/:id',
        loadComponent: () => import('./demo/pages/Project/sprint/sprint.component').then((m) => m.SprintComponent)
      },
      {
        path: 'task-detail/:id',
        loadComponent: () =>
          import('./demo/pages/Project/task-detail-page/task-detail-page.component').then((m) => m.TaskDetailPageComponent)
      },
      {
        path: 'dashboard-poll',
        loadComponent: () => import('./demo/pages/dashboard-poll/dashboard-poll.component').then((m) => m.DashboardPollComponent)
      },
      {
        path: 'project-dashboard/project-taskboard/:id',
        loadComponent: () =>
          import('./demo/pages/Project/project-taskboard/project-taskboard.component').then((m) => m.ProjectTaskboardComponent)
      },
      {
        path: 'organization-details/authentication-setting/:id',
        loadComponent: () =>
          import('./demo/pages/organization-authentication/organization-authentication.component').then(
            (m) => m.OrganizationAuthenticationComponent
          )
      },

      {
        path: 'project-dashboard',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./demo/pages/Project/project-dashboard/project-dashboard.component').then((m) => m.ProjectDashboardComponent)
          },
          {
            path: 'add-Project',
            loadComponent: () => import('./project-management/projectadd/projectadd.component').then((m) => m.ProjectaddComponent)
          },
          {
            path: 'add-Project/:id',
            loadComponent: () => import('./project-management/projectadd/projectadd.component').then((m) => m.ProjectaddComponent)
          },
          {
            path: 'assignUser/:id',
            loadComponent: () => import('./project-management/assignuser/assignuser.component').then((m) => m.AssignuserComponent)
          }
        ]
      },
      {
        path: 'addtask-popup',
        loadComponent: () => import('./demo/pages/Project/add-task-popup/add-task-popup.component').then((m) => m.AddTaskPopupComponent)
      },
      {
        path: 'ticket-detail',
        loadComponent: () => import('./demo/pages/tickets/tickets-detail/tickets-detail.component').then((m) => m.TicketsDetailComponent)
      },
      {
        path: 'ticket-detail/:id',
        loadComponent: () => import('./demo/pages/tickets/tickets-detail/tickets-detail.component').then((m) => m.TicketsDetailComponent)
      },
      {
        path: 'ticket',
        loadComponent: () => import('./demo/pages/tickets/ticket-list/ticket-list.component').then((m) => m.TicketListComponent)
      },
      {
        path: 'ticket/ticket-form',
        loadComponent: () => import('./demo/pages/tickets/ticket-form/ticket-form.component').then((m) => m.TicketFormComponent)
      },
      {
        path: 'ticket-new-detail/:id',
        loadComponent: () =>
          import('./demo/pages/tickets/new-ticket-detail/new-ticket-detail.component').then((m) => m.NewTicketDetailComponent)
      },
      {
        path: 'ticket-new',
        loadComponent: () => import('./demo/pages/tickets/new-ticket-page/new-ticket-page.component').then((m) => m.NewTicketPageComponent)
      },
      {
        path: 'ticket/ticket-form/:id',
        loadComponent: () => import('./demo/pages/tickets/ticket-form/ticket-form.component').then((m) => m.TicketFormComponent)
      },
      {
        path: 'birthday',
        loadComponent: () => import('./demo/pages/birthday/birthday.component').then((m) => m.BirthdayComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./demo/pages/dashboard-profile/dashboard-profile.component').then((m) => m.DashboardProfileComponent)
      },
      {
        path: 'attendance_leave',
        loadComponent: () =>
          import('./demo/pages/dashboard-attendance-and-leave/dashboard-attendance-and-leave.component').then(
            (m) => m.DashboardAttendanceAndLeaveComponent
          )
      },
      {
        path: 'shift-schedule',
        loadComponent: () =>
          import('./demo/pages/shift-schedule-list/shift-schedule-list.component').then((m) => m.ShiftScheduleListComponent)
      },
      {
        path: 'shift-schedule/shift-schedule-form',
        loadComponent: () =>
          import('./demo/pages/shift-schedule-form/shift-schedule-form.component').then((m) => m.ShiftScheduleFormComponent)
      },
      {
        path: 'shift-schedule/shift-schedule-form/:id',
        loadComponent: () =>
          import('./demo/pages/shift-schedule-form/shift-schedule-form.component').then((m) => m.ShiftScheduleFormComponent)
      },
      {
        path: 'promotion',
        loadComponent: () => import('./demo/pages/promotion-list/promotion-list.component').then((m) => m.PromotionListComponent)
      },
      {
        path: 'promotion/promotion-form',
        loadComponent: () => import('./demo/pages/promotion-form/promotion-form.component').then((m) => m.PromotionFormComponent)
      },
      {
        path: 'promotion/promotion-form/:id',
        loadComponent: () => import('./demo/pages/promotion-form/promotion-form.component').then((m) => m.PromotionFormComponent)
      },
      {
        path: 'admin/poll-list',
        loadComponent: () => import('./demo/pages/poll-detail/poll-detail.component').then((m) => m.PollDetailComponent)
      },
      {
        path: 'add/poll-detail',
        loadComponent: () => import('./demo/pages/poll-form/poll-form.component').then((m) => m.PollFormComponent)
      },
      {
        path: 'add/poll-detail/:id',
        loadComponent: () => import('./demo/pages/poll-form/poll-form.component').then((m) => m.PollFormComponent)
      },
      {
        path: 'vote-detail/:id',
        loadComponent: () => import('./demo/pages/poll-vote-detail/poll-vote-detail.component').then((m) => m.PollVoteDetailComponent)
      },
      {
        path: 'user-shift-schedule/detail',
        loadComponent: () =>
          import('./demo/pages/user-shift-schedule/user-shift-schedule.component').then((m) => m.UserShiftScheduleComponent)
      },
      {
        path: 'user-shift-schedule/add',
        loadComponent: () =>
          import('./demo/pages/user-shift-schedule-form/user-shift-schedule-form.component').then((m) => m.UserShiftScheduleFormComponent)
      },
      {
        path: 'user-shift-schedule/:id',
        loadComponent: () =>
          import('./demo/pages/user-shift-schedule-form/user-shift-schedule-form.component').then((m) => m.UserShiftScheduleFormComponent)
      },
      {
        path: 'user-shift-schedule/:id',
        loadComponent: () =>
          import('./demo/pages/user-shift-schedule-form/user-shift-schedule-form.component').then((m) => m.UserShiftScheduleFormComponent)
      },
      {
        path: 'overtime_detail',
        loadComponent: () =>
          import('./demo/pages/admin-overtime-view/admin-overtime-view.component').then((m) => m.AdminOvertimeViewComponent)
      },
      {
        path: 'employee_overtime_detail',
        loadComponent: () =>
          import('./demo/pages/user-overtime-request/user-overtime-request.component').then((m) => m.UserOvertimeRequestComponent)
      },
      {
        path: 'employee-personal-insurance',
        loadComponent: () =>
          import('./demo/pages/employee-personal-insurance-list/employee-personal-insurance-list.component').then(
            (m) => m.EmployeePersonalInsuranceListComponent
          )
      },
      {
        path: 'employee-personal-insurance/employee-personal-insurance-details',
        loadComponent: () =>
          import('./demo/pages/employee-personal-insurance-form/employee-personal-insurance-form.component').then(
            (m) => m.EmployeePersonalInsuranceFormComponent
          )
      },
      {
        path: 'employee-personal-insurance/employee-personal-insurance-details/:id',
        loadComponent: () =>
          import('./demo/pages/employee-personal-insurance-form/employee-personal-insurance-form.component').then(
            (m) => m.EmployeePersonalInsuranceFormComponent
          )
      },
      {
        path: 'goal-details',
        loadComponent: () => import('./demo/pages/goal/goal/goal.component').then((m) => m.GoalComponent)
      },
      {
        path: 'goal/add',
        loadComponent: () => import('./demo/pages/goal/goal-form/goal-form.component').then((m) => m.GoalFormComponent)
      },
      {
        path: 'goal/add/:id',
        loadComponent: () => import('./demo/pages/goal/goal-form/goal-form.component').then((m) => m.GoalFormComponent)
      },
      {
        path: 'goal/type',
        loadComponent: () => import('./demo/pages/goal-type/goal-type.component').then((m) => m.GoalTypeComponent)
      },
      {
        path: 'to-do',
        loadComponent: () => import('./demo/pages/to-do-list/to-do-list.component').then((m) => m.ToDoListComponent)
      },
      {
        path: 'person/checkin-out/byadmin',
        loadComponent: () => import('./demo/pages/person-checkin-out/person-checkin-out.component').then((m) => m.PersonCheckinOutComponent)
      },
      {
        path: 'inquiry/list',
        loadComponent: () => import('./demo/pages/inquiry-list/inquiry-list.component').then((m) => m.InquiryListComponent)
      },
      {
        path: 'contact/information',
        loadComponent: () => import('./demo/pages/contact-group/contact-info/contact-info.component').then((m) => m.ContactInfoComponent)
      },
      {
        path: 'contact/form',
        loadComponent: () => import('./demo/pages/contact-group/contact-form/contact-form.component').then((m) => m.ContactFormComponent)
      },
      {
        path: 'contact/form/:id',
        loadComponent: () => import('./demo/pages/contact-group/contact-form/contact-form.component').then((m) => m.ContactFormComponent)
      },
      {
        path: 'birthday-calendar',
        loadComponent: () => import('./demo/pages/birthday-calendar/birthday-calendar.component').then((m) => m.BirthdayCalendarComponent)
      },
      {
        path: 'leave-history',
        loadComponent: () => import('./demo/pages/leave-history/leave-history.component').then((m) => m.LeaveHistoryComponent)
      },
      {
        path: 'leave-settings',
        loadComponent: () => import('./demo/pages/leave-settings/leave-settings.component').then((m) => m.LeaveSettingsComponent)
      },
      {
        path: 'leave-type',
        loadComponent: () => import('./demo/pages/leave-type/leave-type.component').then((m) => m.LeaveTypeComponent)
      },
      {
        path: 'meeting-room',
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full'
          },
          {
            path: 'details',
            loadComponent: () => import('./meeting/meeting.component').then((m) => MeetingComponent)
          },
          {
            path: 'form',
            loadComponent: () => import('./meeting/meeting-form/meeting-form.component').then((m) => MeetingFormComponent)
          },
          {
            path: 'form/:id',
            loadComponent: () => import('./meeting/meeting-form/meeting-form.component').then((m) => MeetingFormComponent)
          }
        ]
      },
      {
        path: 'Report',
        children: [
          {
            path: '',
            redirectTo: 'room-booking-report',
            pathMatch: 'full'
          },
          {
            path: 'room-booking-report',
            loadComponent: () =>
              import('./report/room-booking-report/room-booking-report.component').then((m) => RoomBookingReportComponent)
          },
          {
            path: 'form',
            loadComponent: () => import('./meeting/meeting-form/meeting-form.component').then((m) => MeetingFormComponent)
          },
          {
            path: 'form/:id',
            loadComponent: () => import('./meeting/meeting-form/meeting-form.component').then((m) => MeetingFormComponent)
          }
        ]
      },

      {
        path: 'meetings-room',
        children: [
          {
            path: '',
            redirectTo: 'booking',
            pathMatch: 'full'
          },
          {
            path: 'booking',
            loadComponent: () => import('./room-booking/room-booking.component').then((m) => RoomBookingComponent)
          },
          {
            path: 'form',
            loadComponent: () => import('./meeting/meeting-form/meeting-form.component').then((m) => MeetingFormComponent)
          }
        ]
      },
      {
        path: 'companyprofiledetail',
        loadComponent: () =>
          import('./demo/pages/companyprofile-form/companyprofile-form.component').then((m) => CompanyprofileFormComponent)
      },
      {
        path: 'companyprofile',
        loadComponent: () =>
          import('./demo/pages/companyprofile-list/companyprofile-list.component').then((m) => CompanyprofileListComponent)
      },
      {
        path: 'company-list',
        loadComponent: () => import('./demo/pages/company-group/company-list/company-list.component').then((m) => m.CompanyListComponent)
      },
      {
        path: 'company-list/comapny-detail',
        loadComponent: () => import('./demo/pages/company-group/company-form/company-form.component').then((m) => m.CompanyFormComponent)
      },
      {
        path: 'company-list/comapny-detail/:id',
        loadComponent: () => import('./demo/pages/company-group/company-form/company-form.component').then((m) => m.CompanyFormComponent)
      },
      {
        path: 'feedback-suggestions',
        loadComponent: () => import('./feedback-suggestions/feedback-suggestions.component').then((m) => m.FeedbackSuggestionsComponent)
      },
      {
        path: 'user/warning-details',
        loadComponent: () =>
          import('./demo/pages/dashboard-user-warning/dashboard-user-warning.component').then((m) => m.DashboardUserWarningComponent)
      },
      {
        path: 'feedback-suggestions',
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full'
          },
          {
            path: 'feedback-suggestions',
            loadComponent: () => import('./feedback-suggestions/feedback-suggestions.component').then((m) => m.FeedbackSuggestionsComponent)
          },
          {
            path: 'Addsuggestion',
            loadComponent: () =>
              import('./feedback-suggestions/addsuggestions/addsuggestions.component').then((m) => AddsuggestionsComponent)
          }
        ]
      },

      {
        path: 'Admin-feedback',
        loadComponent: () => import('./feedback-suggestions/admin-feedback/admin-feedback.component').then((m) => m.AdminFeedbackComponent)
      }, 

      {
        path: 'warning',
        loadComponent: () => import('./warning/warning.component').then((m) => m.WarningComponent)
      },
      {
        path: 'warning',
        children: [
          {
            path: '',
            redirectTo: 'details',
            pathMatch: 'full'
          },
          {
            path: 'warning',
            loadComponent: () => import('./warning/warning.component').then((m) => m.WarningComponent)
          },
          {
            path: 'warning-form',
            loadComponent: () => import('./warning-form/warning-form.component').then((m) => WarningFormComponent)
          }
        ]
      },
      {
        path: 'newprofile',
        loadComponent: () => import('./profile/pro-detail/pro-detail.component').then((m) => m.ProDetailComponent)
      },
      {
        path: 'profilelist',
        loadComponent: () => import('./profile/profile-list/profile-list.component').then((m) => m.ProfileListComponent)
      }, 

      {
        path: 'admin-dashboard2',
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
      },
      {
        path: 'admin-dashboard',
        loadComponent: () => import('./new-admin-dashboard2/new-admin-dashboard2.component').then((m) => m.NewAdminDashboard2Component)
      },
      {
        path: 'new-project-page/:id',
        loadComponent: () =>
          import('./demo/pages/Project/new-project-detail-page/new-project-detail-page.component').then(
            (m) => m.NewProjectDetailPageComponent
          )
      },
      {
        path: 'notification-history',
        loadComponent: () =>
          import('./theme/layouts/admin/nav-bar/notification-history/notification-history.component').then(
            (m) => m.NotificationHistoryComponent
          )
      },
      {
        path: 'employee-webcam/:id',
        loadComponent: () =>
          import('./demo/pages/Employee/employee-webcam/employee-webcam.component').then((m) => m.EmployeeWebcamComponent)
      }, 
      {
        path: 'employee-webcam/:id',
        loadComponent: () =>
          import('./demo/pages/Employee/employee-webcam/employee-webcam.component').then((m) => m.EmployeeWebcamComponent)
      }
    ]
  },

  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      }, 
      {
        path: 'facedetection-new',
        loadComponent: () => import('./demo/authentication/facedetection-new/facedetection-new.component').then((m) => m.FacedetectionNewComponent)
      },
      {
        path: 'facedetection',
        loadComponent: () => import('./demo/authentication/facedetection/facedetection.component').then((m) => m.FacedetectionComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      },
      {
        path: 'career',
        loadComponent: () => import('./demo/authentication/skyttus-career/skyttus-career.component').then((m) => m.SkyttusCareerComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./demo/authentication/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent)
      },
      {
        path: 'quick-checkIn',
        loadComponent: () => import('./demo/authentication/quick-check-in/quick-check-in.component').then((m) => m.QuickCheckInComponent)
      },
      {
        path: 'verify-checkIn-otp',
        loadComponent: () => import('./demo/authentication/check-in-otp/check-in-otp.component').then((m) => m.CheckInOtpComponent)
      },
      {
        path: 'verify-otp',
        loadComponent: () => import('./demo/authentication/otp/otp.component').then((m) => m.OtpComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./demo/authentication/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
      },
      {
        path: 'two-factor-authenticaton',
        loadComponent: () => import('./demo/authentication/facedetection/facedetection.component').then((m) => m.FacedetectionComponent)
      }
    ]
  }
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Don't perform initial navigation in iframes or popups
      initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
