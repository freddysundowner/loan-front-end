import { Routes, RouterModule } from '@angular/router';
import { MemberAreaLoanComponent } from './member-area-loan.component';
import { MemberAreaViewLoanComponent } from './view/member-area-view-loan.component';
import { MemberAreaLoanResolverService } from './data/member-area-loan-resolver.service';
import { MemberAreaViewLoanGeneralComponent } from './view/general/member-area-view-loan-general.component';
import { MemberAreaViewLoanAdjustmentComponent } from './view/adjustment/member-area-view-loan-adjustment.component';
import { MemberAreaViewLoanCollateralComponent } from './view/collateral/member-area-view-loan-collateral.component';
import { MemberAreaViewLoanGuarantorsComponent } from './view/guarantors/member-area-view-loan-guarantors.component';
import { MemberAreaViewLoanPaymentsComponent } from './view/payments/member-area-view-loan-payments.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: MemberAreaLoanComponent
    },
    {
        path: ':id',
        component: MemberAreaViewLoanComponent,
        resolve : { loan: MemberAreaLoanResolverService},
        children: [
            { path: '', component: MemberAreaViewLoanGeneralComponent },
            { path: 'adjustments', component: MemberAreaViewLoanAdjustmentComponent },
            { path: 'payments', component: MemberAreaViewLoanPaymentsComponent },
            { path: 'collateral', component: MemberAreaViewLoanCollateralComponent },
            { path: 'guarantors', component: MemberAreaViewLoanGuarantorsComponent }
        ]
    },
];

export const MemberAreaLoanRoutingModule = RouterModule.forChild(ROUTES);
