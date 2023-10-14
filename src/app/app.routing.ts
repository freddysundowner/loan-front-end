import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './auth/auth.guard';
import { AppPreloadingStrategy } from './app-preloading-strategy';
import { PermissionGuardService } from './auth/permission-guard-service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
       // loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'expenses',
       // loadChildren: './expenses/expense.module#ExpenseModule',
        loadChildren: () => import('./expenses/expense.module').then(m => m.ExpenseModule),
        canActivate: [AuthGuard],
        data: { preload: true, delay: false }
      },
      {
        path: 'members',
      //  loadChildren: './members/member.module#MemberModule',
        loadChildren: () => import('./members/member.module').then(m => m.MemberModule),
        data: { preload: true, delay: false }
      },
      {
        path: 'loans',
       // loadChildren: './loans/loan.module#LoanModule',
        loadChildren: () => import('./loans/loan.module').then(m => m.LoanModule),

        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'loan-applications',
       // loadChildren: './loan-applications/loan-application.module#LoanApplicationModule',
        loadChildren: () => import('./loan-applications/loan-application.module').then(m => m.LoanApplicationModule),
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'payments',
       // loadChildren: './payments/payment.module#MemberAreaPaymentModule',
        loadChildren: () => import('./payments/payment.module').then(m => m.PaymentModule),
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'withdrawals',
      //  loadChildren: './withdrawals/withdrawal.module#MemberAreaWithdrawalModule',
        loadChildren: () => import('./withdrawals/withdrawal.module').then(m => m.WithdrawalModule),

        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'settings',
       // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./settings/setting.module').then(m => m.SettingModule),

        canActivate: [AuthGuard]
      },
      {
        path: 'mpesa',
       // loadChildren: './mpesa/mpesa.module#MpesaModule',
        loadChildren: () => import('./mpesa/mpesa.module').then(m => m.MpesaModule),

        canActivate: [AuthGuard]
      },
     /* {
        path: 'sms',
        loadChildren: () => import('./sms/sms.module').then(m => m.SmsModule),
        canActivate: [AuthGuard]
      },*/
      {
        path: 'reports',
       // loadChildren: './accounting/accounting.module#AccountingModule',
        loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule),
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'user-profile',
       // loadChildren: './user-profile/user-profile.module#UserProfileModule',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
        canActivate: [AuthGuard],
        data: { preload: true, delay: true }
      },
      {
        path: 'member',
        // loadChildren: './settings/setting.module#SettingModule',
        loadChildren: () => import('./member-area/member-area.module').then(m => m.MemberAreaModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      },
      {
        path: 'member-reports',
        loadChildren: () => import('./member-area/reports/member-area-reports.module')
            .then(m => m.MemberAreaReportsModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      },
      {
        path: 'member-loans',
        loadChildren: () => import('./member-area/loan/member-area-loan.module')
            .then(m => m.MemberAreaLoanModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      },
      {
        path: 'member-loan-applications',
        loadChildren: () => import('./member-area/loan-application/member-area-loan-application.module')
            .then(m => m.MemberAreaLoanApplicationModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      },
      {
        path: 'member-payments',
        loadChildren: () => import('./member-area/member-payment/member-area-payment.module')
            .then(m => m.MemberAreaPaymentModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      },
      {
        path: 'member-withdrawals',
        loadChildren: () => import('./member-area/member-withdrawal/member-area-withdrawal.module')
            .then(m => m.MemberAreaWithdrawalModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      },
      {
        path: 'member-profile',
        loadChildren: () => import('./member-area/profile/member-area-profile.module')
            .then(m => m.MemberAreaProfileModule),
        canActivate: [AuthGuard],
        canLoad: [PermissionGuardService],
        data: {
          permissions: ['member']
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
       useHash: true,
      preloadingStrategy: AppPreloadingStrategy
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
