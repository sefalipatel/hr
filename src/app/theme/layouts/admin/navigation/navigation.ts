import { Injectable } from '@angular/core';
import { AuthGuard } from 'src/app/auth.guard';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  href?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  menuValue?: string;
  children?: Navigation[];
  isExpanded?: boolean;
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'dashboard',
    type: 'group',
    title: 'Default',
    icon: 'ti ti-dashboard',
    children: [ 
      {
        id: 'meeting',
        type: 'collapse',
        title: 'Meeting',
        icon: 'ri-movie-2-line',
        children: [
          {
            id: 'meeting room',
            title: 'meeting room',
            type: 'item',
            url: '/meeting-room',
            classes: 'nav-item',
            icon: 'ri-layout-6-line',
            breadcrumbs: false,
            menuValue: 'MeetingRoom'
          },
          {
            id: 'Room Booking',
            title: 'Room Booking',
            type: 'item',
            url: '/meetings-room',
            classes: 'nav-item',
            icon: 'ri-dashboard-line',
            breadcrumbs: false,
            menuValue: ''
          }
        ]
      },
      {
        id: 'report',
        type: 'collapse',
        title: 'Report',
        icon: 'ri-folder-chart-line',
        children: [
          {
            id: 'room booking report',
            title: 'Room Booking',
            type: 'item',
            url: '/Report',
            classes: 'nav-item',
            icon: 'ri-layout-6-line',
            breadcrumbs: false,
            menuValue: 'RoomBooking' 
          },
          {
            id: 'assethistory',
            title: 'Asset carry History',
            type: 'item',
            url: '/asset-history',
            classes: 'nav-item', 
            icon: 'ri-tv-line',
            breadcrumbs: false,
            menuValue: 'AssetManagement'
          },
          {
            id: 'leaveReport',
            title: 'Leave Report',
            type: 'item',
            url: '/leave-report',
            classes: 'nav-item',
            icon: 'ri-file-chart-fill',
            breadcrumbs: false,
            menuValue: 'LeaveReport'
          },
          {
            id: 'annual-report',
            title: 'Annual Report',
            type: 'item',
            url: '/annual-report',
            classes: 'nav-item', 
            icon: 'ri-file-chart-line',
            breadcrumbs: false,
            menuValue: 'Termination'
          }
        ]
      },
      {
        id: 'adminManagement',
        type: 'collapse',
        title: 'Admin Management',
        icon: 'ri-eye-2-line',
        children: [
          {
            id: 'expense-type-list',
            title: 'Admin Timesheet',
            type: 'item',
            icon: 'ri-money-cny-box-line',
            url: '/timesheet-details',
            classes: 'nav-item',
            breadcrumbs: false,
            menuValue: 'ExpenseType'
          },
          {
            id: 'employee attendance view',
            title: 'Employee Attendance View',
            type: 'item',
            url: '/employee-attendance',
            classes: 'nav-item text-nowrap',
            icon: 'ri-admin-fill',
            breadcrumbs: false,
            menuValue: 'RequestApproval'
          },
          {
            id: 'admin Request approval',
            title: 'Admin Request Management ',
            type: 'item',
            url: '/employee-timeupdate-request',
            classes: 'nav-item',
            icon: 'ri-user-add-line',
            breadcrumbs: false,
            menuValue: 'RequestApproval'
          }, 
          {
            id: 'admin overtime',
            title: 'Person Check-In/Out',
            type: 'item',
            url: '/person/checkin-out/byadmin',
            classes: 'nav-item',
            icon: 'ri-checkbox-circle-line',
            breadcrumbs: false,
            menuValue: 'CheckInOut'
          },
          {
            id: 'feedback-suggestions',
            title: 'Feedback/Suggestion                                                                                         ',
            type: 'item',
            url: '/Admin-feedback',
            classes: 'nav-item',
            icon: 'ri-wallet-line',
            breadcrumbs: false,
            menuValue: 'Suggestion'
          },
          {
            id: 'shift&schedule',
            title: 'Shift & Schedule',
            type: 'item',
            url: '/shift-schedule',
            classes: 'nav-item', 
            icon: 'ri-calendar-2-line',
            breadcrumbs: false,
            menuValue: 'Shift&Schedule'
          },
          {
            id: 'leaveHistory',
            title: 'Leave History',
            type: 'item',
            url: '/leave-history',
            classes: 'nav-item', 
            icon: 'ri-file-chart-line',
            breadcrumbs: false,
            menuValue: 'RequestApproval'
          },
          {
            id: 'leave-type',
            title: 'Leave Type',
            type: 'item',
            url: '/leave-type',
            classes: 'nav-item', 
            icon: 'ri-pages-line',
            breadcrumbs: false,
            menuValue: 'LeaveType'
          },
          {
            id: 'leave-setting',
            title: 'Leave Settings',
            type: 'item',
            url: '/leave-settings',
            classes: 'nav-item', 
            icon: 'ri-file-settings-line',
            breadcrumbs: false,
            menuValue: 'LeaveType'
          }
        ]
      }, 
      {
        id: 'Project',
        type: 'collapse',
        title: 'Project',
        icon: 'ri-projector-line',
        children: [ 
          {
            id: 'project-management',
            title: 'Client',
            type: 'item',
            url: '/client-list',
            classes: 'nav-item', 
            icon: 'ri-projector-line',
            breadcrumbs: false,
            menuValue: 'Client'
          }, 
          {
            title: 'Project',
            type: 'item',
            url: '/project-dashboard',
            classes: 'nav-item', 
            icon: 'ri-projector-line',
            breadcrumbs: false,
            menuValue: 'Projects'
          }
        ]
      },
      
      {
        id: 'LeaveDetailsList',
        title: 'Leave Management',
        type: 'item',
        url: '/employee-leave-details',
        classes: 'nav-item',
        icon: 'ri-share-forward-box-line',
        breadcrumbs: false,
        menuValue: 'RequestApproval'
      },
      {
        id: 'employee-insurance',
        title: 'Employee Insurance',
        type: 'item',
        url: '/employee-insurance-details',
        classes: 'nav-item', 
        icon: 'ri-medicine-bottle-line',
        breadcrumbs: false,
        menuValue: 'Insurance'
      },
      {
        id: 'Attendance',
        type: 'collapse',
        title: 'Employee Management',
        icon: 'ri-calendar-event-line',
        children: [ 
          {
            id: 'expense-list',
            title: 'Expense',
            type: 'item',
            url: '/expense-details',
            classes: 'nav-item',
            icon: 'ri-wallet-line',
            breadcrumbs: false,
            menuValue: 'Expense'
          },
          {
            id: 'user Review',
            title: 'User Review',
            type: 'item',
            url: '/self-review',
            classes: 'nav-item', 
            icon: 'ri-user-search-fill',
            breadcrumbs: false,
            menuValue: ''
          },
          {
            id: 'feedback-suggestions',
            title: 'Feedback/Suggestion',
            type: 'item',
            url: '/feedback-suggestions',
            classes: 'nav-item',
            icon: 'ri-wallet-line',
            breadcrumbs: false,
            menuValue: 'Companypolicy'
          },
          {
            id: 'user Request',
            title: 'User Request',
            type: 'item',
            url: '/employee-request-details',
            classes: 'nav-item',
            icon: 'ri-folder-user-line',
            breadcrumbs: false,
            menuValue: ''
          }, 
        ]
      },
      {
        id: 'Role and Permission',
        type: 'collapse',
        title: 'Role & Permission',
        icon: 'ri-user-settings-line',
        children: [
          {
            id: 'Role',
            title: 'Role',
            type: 'item',
            url: '/user-role-details',
            classes: 'nav-item',
            icon: 'ri-camera-lens-line',
            breadcrumbs: false,
            menuValue: 'Roles'
          },
          {
            id: 'user Request',
            title: 'Permission',
            type: 'item',
            url: '/user-role-permissions',
            classes: 'nav-item',
            icon: 'ri-shake-hands-line',
            breadcrumbs: false,
            menuValue: 'Permission'
          }
        ]
      },
      {
        id: 'Setting',
        type: 'collapse',
        title: 'Setting',
        icon: 'ri-settings-2-line',
        children: [
          {
            id: 'organization',
            title: 'Organization',
            type: 'item',
            url: '/organization-details',
            classes: 'nav-item',
            icon: 'ri-shape-line',
            breadcrumbs: false,
            menuValue: 'Organization'
          },
          {
            id: 'Template',
            title: 'Template',
            type: 'item',
            url: '/system-template-details',
            classes: 'nav-item',
            icon: 'ri-dashboard-line',
            breadcrumbs: false,
            menuValue: 'Template'
          },
          {
            id: 'generalSetting',
            title: 'General Setting',
            type: 'item',
            url: '/system-general-settings',
            classes: 'nav-item',
            icon: 'ri-list-settings-fill',
            breadcrumbs: false,
            menuValue: 'GeneralSettings'
          },
          {
            id: 'Settings',
            title: 'Email-Settings',
            type: 'item',
            url: '/email-setting-details',
            classes: 'nav-item',
            icon: 'ri-mail-settings-line',
            breadcrumbs: false,
            menuValue: 'EmailSettings'
          },
          {
            id: 'Settings',
            title: 'SMS-Settings',
            type: 'item',
            url: '/system-sms-settings',
            classes: 'nav-item',
            icon: 'ri-chat-settings-line',
            breadcrumbs: false,
            menuValue: 'SMSSettings'
          },

          {
            id: 'subscription',
            title: 'Subscription',
            type: 'item',
            url: '/subscription',
            classes: 'nav-item',
            icon: 'ri-wallet-line',
            breadcrumbs: false,
            menuValue: 'Companypolicy'
          },
          {
            id: 'user Request',
            title: 'Designation',
            type: 'item',
            url: '/user-designation',
            classes: 'nav-item',
            icon: 'ri-briefcase-line',
            breadcrumbs: false,
            menuValue: 'Designation'
          },
          {
            id: 'department',
            title: 'Department',
            type: 'item',
            url: '/department',
            classes: 'nav-item',
            icon: 'ri-building-line',
            breadcrumbs: false,
            menuValue: 'Department'
          }
        ]
      },
      {
        id: 'asset',
        type: 'collapse',
        title: 'Asset',
        icon: 'ri-user-settings-line',
        children: [
          {
            id: 'Asset Management',
            title: 'Asset Management',
            type: 'item',
            url: '/asset-management',
            classes: 'nav-item',
            icon: 'ri-stack-line',
            breadcrumbs: false,
            menuValue: 'AssetManagement'
          },
          {
            id: 'Asset Assignment',
            title: 'Asset Assignment',
            type: 'item',
            url: '/asset-assign-details',
            breadcrumbs: false,
            classes: 'nav-item',
            icon: 'ri-folder-user-line',
            menuValue: 'AssetManagement'
          },
          {
            id: 'Asset Category',
            title: 'Asset Category',
            type: 'item',
            url: '/asset-category-details',
            classes: 'nav-item',
            icon: 'ri-bubble-chart-line',
            breadcrumbs: false,
            menuValue: 'AssetManagement'
          }
        ]
      },

      {
        id: 'Payroll',
        type: 'collapse',
        title: 'Finance',
        icon: 'ri-money-euro-box-line',
        children: [
          {
            id: 'invoice',
            title: 'Invoice',
            type: 'item',
            url: '/invoice-details',
            classes: 'nav-item', 
            icon: 'ri-wallet-2-fill',
            breadcrumbs: false,
            menuValue: 'Invoice'
          },
          {
            id: 'payrollComponent',
            title: 'Payroll Component',
            type: 'item',
            url: '/salary-components-details',
            classes: 'nav-item', 
            icon: 'ri-money-rupee-circle-line',
            breadcrumbs: false,
            menuValue: 'PayrollComponents'
          },
          {
            id: 'paySlip',
            title: 'Pay slip',
            type: 'item',
            url: '/employee-payslip',
            classes: 'nav-item', 
            icon: 'ri-pages-fill',
            breadcrumbs: false,
            menuValue: 'Payslip'
          }, 
          {
            id: 'payRoll',
            title: 'Payroll',
            type: 'item',
            url: '/pay-roll',
            classes: 'nav-item', 
            icon: 'ri-money-euro-box-line',
            breadcrumbs: false,
            menuValue: 'Payroll'
          },
          {
            id: 'salary',
            title: 'Salary',
            type: 'item',
            url: '/employee-payroll-details',
            classes: 'nav-item', 
            icon: 'ri-funds-box-fill',
            breadcrumbs: false,
            menuValue: 'Payslip'
          },
          {
            id: 'insurance',
            title: 'Insurance',
            type: 'item',
            url: '/insurance-master',
            classes: 'nav-item', 
            icon: 'ri-home-7-line',
            breadcrumbs: false,
            menuValue: 'Insurance'
          },
          {
            id: 'employeeInsurance',
            title: "Employee's Insurance",
            type: 'item',
            url: '/employee-personal-insurance',
            classes: 'nav-item',
            icon: 'ri-money-dollar-box-fill',
            breadcrumbs: false,
            menuValue: 'Insurance'
          },
          {
            id: 'gratuity',
            title: 'Gratuity',
            type: 'item',
            url: '/employee-gratuity',
            classes: 'nav-item', 
            icon: 'ri-hand-coin-line',
            breadcrumbs: false,
            menuValue: 'Gratuity'
          },
          {
            id: 'loan',
            title: 'Loan',
            type: 'item',
            url: '/employee-loan-details',
            classes: 'nav-item', 
            icon: 'ri-wallet-2-line',
            breadcrumbs: false,
            menuValue: 'Loan'
          },
          {
            id: 'advance',
            title: 'Advance',
            type: 'item',
            url: '/advance-salary',
            classes: 'nav-item',
            icon: 'ri-money-dollar-box-line',
            breadcrumbs: false,
            menuValue: 'Advance'
          },
          {
            id: 'appraisal',
            title: 'Appraisal',
            type: 'item',
            url: '/appraisal',
            classes: 'nav-item', 
            icon: 'ri-money-rupee-circle-line',
            breadcrumbs: false,
            menuValue: 'Appraisal'
          },
          {
            id: 'bonus',
            title: 'Bonus',
            type: 'item',
            url: '/bonus-master-list',
            classes: 'nav-item', 
            icon: 'ri-btc-line',
            breadcrumbs: false,
            menuValue: 'Bonus'
          }
        ]
      },

      {
        id: 'Admin View',
        type: 'collapse',
        title: 'CMS',
        icon: 'ri-copper-coin-line',
        children: [
          {
            id: 'companypolicy',
            title: 'company policy',
            type: 'item',
            url: '/company-policy-details',
            classes: 'nav-item', 
            icon: 'ri-megaphone-line',
            breadcrumbs: false,
            menuValue: 'Companypolicy'
          },
          {
            id: 'companyprofilefrom',
            title: 'Company Profile',
            type: 'item',
            url: '/companyprofiledetail',
            classes: 'nav-item', 
            icon: 'ri-draft-line',
            breadcrumbs: false,
            menuValue: 'Companypolicy'
          },
          {
            id: 'broadcast',
            title: 'Broadcast',
            type: 'item',
            url: '/broadcast',
            classes: 'nav-item', 
            icon: 'ri-money-euro-box-line',
            breadcrumbs: false,
            menuValue: 'Payroll'
          },
          {
            id: 'questionmaster',
            title: 'Question Master',
            type: 'item',
            url: '/quetion',
            classes: 'nav-item', 
            icon: 'ri-question-fill',
            breadcrumbs: false,
            menuValue: 'Review'
          },
          {
            id: 'reviewMaster',
            title: 'Review Master',
            type: 'item',
            url: '/employee-review-master-details',
            classes: 'nav-item', 
            icon: 'ri-list-view',
            breadcrumbs: false,
            menuValue: 'Review'
          },
          {
            id: 'jobinquiry',
            title: 'job Inquiry',
            type: 'item',
            url: '/jobinquiry',
            classes: 'nav-item', 
            icon: 'ri-receipt-fill',
            breadcrumbs: false,
            menuValue: 'Payroll'
          },
          {
            id: 'inquiry',
            title: 'Inquiry',
            type: 'item',
            url: '/inquiry/list',
            classes: 'nav-item', 
            icon: 'ri-pass-pending-line',
            breadcrumbs: false,
            menuValue: 'Payroll'
          },
          {
            id: 'poll',
            title: 'Poll',
            type: 'item',
            url: '/admin/poll-list',
            classes: 'nav-item', 
            icon: 'ri-chat-poll-fill',
            breadcrumbs: false,
            menuValue: 'Poll'
          },
          {
            id: 'warning',
            title: 'Warning                                                                                         ',
            type: 'item',
            url: '/warning',
            classes: 'nav-item',
            icon: 'ri-file-warning-fill',
            breadcrumbs: false,
            menuValue: 'Warning'
          },
          {
            id: 'promotion',
            title: 'Promotion',
            type: 'item',
            url: '/promotion',
            classes: 'nav-item', 
            icon: 'ri-megaphone-line',
            breadcrumbs: false,
            menuValue: 'Promotion'
          },
          {
            id: 'multipleDocument',
            title: 'Bulk Document',
            type: 'item',
            url: '/multipleDocument',
            classes: 'nav-item', 
            icon: 'ri-file-copy-2-fill',
            breadcrumbs: false,
            menuValue: 'Promotion'
          },
          {
            id: 'termination',
            title: 'Termination',
            type: 'item',
            url: '/termination-list',
            classes: 'nav-item', 
            icon: 'ri-close-circle-fill',
            breadcrumbs: false,
            menuValue: 'Termination'
          },
          {
            id: 'contact-list',
            title: 'Contact',
            type: 'item',
            url: '/contact/information',
            classes: 'nav-item', 
            icon: 'ri-contacts-book-fill',
            breadcrumbs: false,
            menuValue: 'Contact'
          },
          {
            id: 'company-list',
            title: 'Company',
            type: 'item',
            url: '/company-list',
            classes: 'nav-item', 
            icon: 'ri-community-fill',
            breadcrumbs: false,
            menuValue: 'Company'
          },
          {
            id: 'goal',
            title: 'Goal',
            type: 'item',
            url: '/goal-details',
            classes: 'nav-item', 
            icon: 'ri-chat-poll-fill',
            breadcrumbs: false,
            menuValue: 'Goal'
          }
        ]
      },
      {
        id: 'resignation',
        title: 'Resignation',
        type: 'item',
        url: '/resignation-list',
        classes: 'nav-item', 
        icon: 'ri-user-unfollow-fill',
        breadcrumbs: false,
        menuValue: 'Resignation'
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems; //.filter(x => localStorage.getItem('roleName') == 'Admin' || (x.id != 'Roles' && x.id != 'Setting'));
  }
}
