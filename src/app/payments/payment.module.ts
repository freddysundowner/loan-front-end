import { NgModule } from '@angular/core';

import { PaymentRoutingModule } from './payment-routing.module';
import { MaterialModule } from '../shared/material.module';
import { AddPaymentComponent } from './general/add/add-payment.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PaymentDetailComponent } from './details/payment-detail.component';
import { PaymentComponent } from './payment.component';
import { GeneralPaymentComponent } from './general/general-payment.component';
import { ReviewPaymentComponent } from './review/review-payment.component';
import { StatusChangeComponent } from './status-change/status-change.component';

@NgModule({
    imports: [
        MaterialModule,
        PaymentRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        GeneralPaymentComponent,
        AddPaymentComponent,
        PaymentDetailComponent,
        PaymentComponent,
        ReviewPaymentComponent,
        StatusChangeComponent
    ],
    entryComponents: [
        AddPaymentComponent,
        PaymentDetailComponent
    ]
})

export class PaymentModule {}
