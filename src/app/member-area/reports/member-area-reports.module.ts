import { NgModule } from '@angular/core';

import { MemberAreaReportsRoutingModule } from './member-area-reports-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { MemberAreaReportsComponent } from './member-area-reports.component';
import { MemberAreaStatementComponent } from '../accounts/statement/member-area-statement.component';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaReportsRoutingModule,
    ],
    declarations: [
        MemberAreaReportsComponent,
        MemberAreaStatementComponent
    ]
})

export class MemberAreaReportsModule {}
