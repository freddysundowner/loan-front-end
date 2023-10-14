import { NgModule } from '@angular/core';

import { MemberAreaProfileRoutingModule } from './member-area-profile-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { MemberAreaProfileComponent } from './member-area-profile.component';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaProfileRoutingModule,
    ],
    declarations: [
        MemberAreaProfileComponent,
    ]
})

export class MemberAreaProfileModule {}
