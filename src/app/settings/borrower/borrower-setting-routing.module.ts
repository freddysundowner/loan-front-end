import { Routes, RouterModule } from '@angular/router';
import { BorrowerSettingComponent } from './borrower-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: BorrowerSettingComponent,
        children: [
            {
                path: '',
               // loadChildren: 'app/settings/borrower/witness-type/witness-type-setting.module#WitnessTypeSettingModule'
                loadChildren: () => import('app/settings/borrower/group/member-group-setting.module').then(m => m.MemberGroupSettingModule)
            },
            {
                path: 'witness_types',
                // loadChildren: 'app/settings/borrower/status/borrower-status-setting.module#BorrowerStatusSettingModule'
                loadChildren: () => import('app/settings/borrower/witness-type/witness-type-setting.module').then(m => m.WitnessTypeSettingModule)
            },
            {
                path: 'status',
               // loadChildren: 'app/settings/borrower/status/borrower-status-setting.module#BorrowerStatusSettingModule'
                loadChildren: () => import('app/settings/borrower/status/borrower-status-setting.module').then(m => m.BorrowerStatusSettingModule)
            }
        ]
    }
];

export const BorrowerSettingRoutingModule = RouterModule.forChild(ROUTES);
