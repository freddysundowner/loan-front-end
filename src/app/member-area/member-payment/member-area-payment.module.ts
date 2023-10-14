import { NgModule } from '@angular/core';

import { MemberAreaPaymentRoutingModule } from './member-area-payment-routing.module';
import { MemberAreaAddPaymentComponent } from './general/add/member-area-add-payment.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MemberAreaPaymentDetailComponent } from './details/member-area-payment-detail.component';
import { MemberAreaPaymentComponent } from './member-area-payment.component';
import { MemberAreaGeneralPaymentComponent } from './general/member-area-general-payment.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaPaymentRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        MemberAreaGeneralPaymentComponent,
        MemberAreaAddPaymentComponent,
        MemberAreaPaymentDetailComponent,
        MemberAreaPaymentComponent
    ],
    entryComponents: [
        MemberAreaAddPaymentComponent,
        MemberAreaPaymentDetailComponent
    ]
})

export class MemberAreaPaymentModule {}
