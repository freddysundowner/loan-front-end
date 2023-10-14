import { NgModule } from '@angular/core';

import { MemberAreaWithdrawalRoutingModule } from './member-area-withdrawal-routing.module';
import { MemberAreaWithdrawalComponent } from './member-area-withdrawal.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MemberAreaWithdrawalDetailComponent } from './details/member-area-withdrawal-detail.component';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaWithdrawalRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        MemberAreaWithdrawalComponent,
        MemberAreaWithdrawalDetailComponent,
    ],
    entryComponents: [
        MemberAreaWithdrawalDetailComponent
    ]
})

export class MemberAreaWithdrawalModule {}
