import { Routes, RouterModule } from '@angular/router';
import { MemberAreaGeneralPaymentComponent } from './general/member-area-general-payment.component';
import { MemberAreaAddPaymentComponent } from './general/add/member-area-add-payment.component';
import { MemberAreaPaymentComponent } from './member-area-payment.component';
import { ReviewPaymentComponent } from '../../payments/review/review-payment.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: MemberAreaPaymentComponent,
        children: [
            { path: '', component: MemberAreaGeneralPaymentComponent },
         /*   {
                path: 'management',
                //loadChildren: 'app/loan-applications/view/manage/application-manage.module#MemberAreaApplicationManageModule',
                loadChildren: () => import('app/loan-applications/view/manage/application-manage.module').then(m => m.MemberAreaApplicationManageModule),
                canLoad: [PermGuard],
                data: {
                    permissions: ['loan-application-review'],
                    preload: true,
                    delay: true
                }
            },*/
        ]
    },
];

export const MemberAreaPaymentRoutingModule = RouterModule.forChild(ROUTES);
