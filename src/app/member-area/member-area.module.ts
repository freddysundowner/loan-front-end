import { NgModule } from '@angular/core';
import { MemberAreaRoutingModule } from './member-area-routing.module';
import { MemberAreaComponent } from './member-area.component';
import { MaterialModule } from '../shared/material.module';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaRoutingModule
    ],
    declarations: [
        MemberAreaComponent
    ]
})

export class MemberAreaModule {

    constructor () {
    }
}
