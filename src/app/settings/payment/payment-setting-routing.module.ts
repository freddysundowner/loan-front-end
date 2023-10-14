import { Routes, RouterModule } from '@angular/router';
import { PaymentSettingComponent } from './payment-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: PaymentSettingComponent,
        children: [
            {
                path: '',
              //  loadChildren: 'app/settings/payment/method/payment-method-setting.module#PaymentMethodSettingModule'
                loadChildren: () => import('app/settings/payment/method/payment-method-setting.module').then(m => m.PaymentMethodSettingModule)
            },
            {
                path: 'status',
              //  loadChildren: 'app/settings/payment/status/payment-status-setting.module#PaymentStatusSettingModule'
                loadChildren: () => import('app/settings/payment/status/payment-status-setting.module').then(m => m.PaymentStatusSettingModule)
            }
        ]
    }
];

export const PaymentSettingRoutingModule = RouterModule.forChild(ROUTES);
