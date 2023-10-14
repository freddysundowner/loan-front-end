import { Routes, RouterModule } from '@angular/router';
import { MemberAreaLoanApplicationComponent } from './member-area-loan-application.component';
import { MemberAreaViewLoanApplicationComponent } from './view/member-area-view-loan-application.component';
import { MemberAreaViewApplicationGeneralComponent } from './view/general/member-area-view-application-general.component';
import { MemberAreaApplicationGuarantorComponent } from './view/guarantor/member-area-application-guarantor.component';
import { MemberAreaApplicationSecurityComponent } from './view/securitty/member-area-application-security.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: MemberAreaLoanApplicationComponent
    },
    {
        path: ':id',
        component: MemberAreaViewLoanApplicationComponent,
       // resolve : { loanApp: LoanApplicationResolverService},
        children: [
            { path: '', component: MemberAreaViewApplicationGeneralComponent },
            { path: 'guarantors', component: MemberAreaApplicationGuarantorComponent },
            { path: 'collateral', component: MemberAreaApplicationSecurityComponent }
        ]
    }
];

export const MemberAreaLoanApplicationRoutingModule = RouterModule.forChild(ROUTES);
