import { Routes, RouterModule } from '@angular/router';
import { AccountSettingComponent } from './account-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: AccountSettingComponent,
        children: [
            {
                path: '',
               // loadChildren: 'app/settings/account/capital/capital-setting.module#CapitalSettingModule'
                loadChildren: () => import('app/settings/account/capital/capital-setting.module').then(m => m.CapitalSettingModule)
            },
           {
                path: 'capital',
              //  loadChildren: 'app/settings/account/capital/capital-setting.module#CapitalSettingModule'
               loadChildren: () => import('app/settings/account/capital/capital-setting.module').then(m => m.CapitalSettingModule)

           },
            {
                path: 'account',
             //   loadChildren: 'app/settings/account/period/period-setting.module#PeriodSettingModule'
                loadChildren: () => import('app/settings/account/period/period-setting.module').then(m => m.PeriodSettingModule)
            }
        ]
    }
];

export const AccountSettingRoutingModule = RouterModule.forChild(ROUTES);
