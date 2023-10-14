import { NgModule } from '@angular/core';

import { ApplicationManageRoutingModule } from './application-manage-routing.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MemberAreaApplicationManageComponent } from './member-area-application-manage.component';
import { MaterialModule } from '../../../../shared/material.module';

@NgModule({
    imports: [
        MaterialModule,
        ApplicationManageRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        MemberAreaApplicationManageComponent
    ],
    entryComponents: [
    ]
})

export class MemberAreaApplicationManageModule {}
