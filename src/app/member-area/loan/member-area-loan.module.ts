import { NgModule } from '@angular/core';

import { MemberAreaLoanRoutingModule } from './member-area-loan-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { MemberAreaLoanComponent } from './member-area-loan.component';
import { MemberAreaLoanAmortizationComponent } from './amortization/member-area-loan-amortization.component';
import { MemberAreaViewLoanAdjustmentComponent } from './view/adjustment/member-area-view-loan-adjustment.component';
import { MemberAreaViewLoanPaymentsComponent } from './view/payments/member-area-view-loan-payments.component';
import { MemberAreaViewLoanCollateralComponent } from './view/collateral/member-area-view-loan-collateral.component';
import { MemberAreaViewLoanGeneralComponent } from './view/general/member-area-view-loan-general.component';
import { MemberAreaViewLoanGuarantorsComponent } from './view/guarantors/member-area-view-loan-guarantors.component';
import { MemberAreaViewLoanLoanApplicationsComponent } from './view/loan-applications/member-area-view-loan-loan-applications.component';
import { MemberAreaPenaltyAdjustmentComponent } from './view/payments/adjustment/penalty/member-area-penalty-adjustment.component';
import { MemberAreaPenaltyTransactionComponent } from './view/payments/transactions/penalty/member-area-penalty-transaction.component';
import { MemberAreaPrincipalTransactionComponent } from './view/payments/transactions/principal/member-area-principal-transaction.component';
import { MemberAreaInterestTransactionComponent } from './view/payments/transactions/member-area-interest-transaction.component';
import { MemberAreaViewLoanComponent } from './view/member-area-view-loan.component';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaLoanRoutingModule,
    ],
    declarations: [
        MemberAreaLoanComponent,
        MemberAreaLoanAmortizationComponent,
        MemberAreaViewLoanAdjustmentComponent,
        MemberAreaViewLoanPaymentsComponent,
        MemberAreaViewLoanCollateralComponent,
        MemberAreaViewLoanGeneralComponent,
        MemberAreaViewLoanGuarantorsComponent,
        MemberAreaViewLoanLoanApplicationsComponent,
        MemberAreaPenaltyAdjustmentComponent,
        MemberAreaPenaltyTransactionComponent,
        MemberAreaPrincipalTransactionComponent,
        MemberAreaInterestTransactionComponent,
        MemberAreaViewLoanComponent
    ]
})

export class MemberAreaLoanModule {}
