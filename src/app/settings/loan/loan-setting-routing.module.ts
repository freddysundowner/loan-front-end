import { Routes, RouterModule } from '@angular/router';
import { LoanSettingComponent } from './loan-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: LoanSettingComponent,
        children: [
            {
                path: '',
               // loadChildren: 'app/settings/loan/type/loan-type-setting.module#LoanTypeSettingModule'
                loadChildren: () => import('app/settings/loan/type/loan-type-setting.module').then(m => m.LoanTypeSettingModule)
            },
           {
                path: 'type',
               // loadChildren: 'app/settings/loan/type/loan-type-setting.module#LoanTypeSettingModule'
               loadChildren: () => import('app/settings/loan/type/loan-type-setting.module').then(m => m.LoanTypeSettingModule)
           },
            {
                path: 'charges',
                // loadChildren: 'app/settings/loan/status/loan-status-setting.module#LoanStatusSettingModule'
                loadChildren: () => import('app/settings/loan/other-charges/loan-charges-setting.module').then(m => m.LoanChargesSettingModule)
            },
            {
                path: 'status',
               // loadChildren: 'app/settings/loan/status/loan-status-setting.module#LoanStatusSettingModule'
                loadChildren: () => import('app/settings/loan/status/loan-status-setting.module').then(m => m.LoanStatusSettingModule)
            },
            {
                path: 'interest_type',
               // loadChildren: 'app/settings/loan/interest-type/interest-type-setting.module#InterestTypeSettingModule'
                loadChildren: () => import('app/settings/loan/interest-type/interest-type-setting.module').then(m => m.InterestTypeSettingModule)
            },
            {
                path: 'payment_frequency',
              //  loadChildren: 'app/settings/loan/payment-frequency/payment-frequency-setting.module#PaymentFrequencySettingModule'
                loadChildren: () => import('app/settings/loan/payment-frequency/payment-frequency-setting.module').then(m => m.PaymentFrequencySettingModule)
            }
        ]
    }
];

export const LoanSettingRoutingModule = RouterModule.forChild(ROUTES);
