import { Routes, RouterModule } from '@angular/router';
import { GeneralPaymentComponent } from './general/general-payment.component';
import { AddPaymentComponent } from './general/add/add-payment.component';
import { PaymentComponent } from './payment.component';
import { ReviewPaymentComponent } from './review/review-payment.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: PaymentComponent,
        children: [
            { path: '', component: GeneralPaymentComponent },
            { path: 'review', component: ReviewPaymentComponent },
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
    { path: 'create', component: AddPaymentComponent },
];

export const PaymentRoutingModule = RouterModule.forChild(ROUTES);
