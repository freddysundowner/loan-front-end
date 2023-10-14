import { NgModule } from '@angular/core';

import { MemberGroupSettingRoutingModule } from './member-group-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { MemberGroupSettingComponent } from './member-group-setting.component';
import { AddMemberGroupComponent } from './add/add-member-group.component';
import { EditMemberGroupComponent } from './edit/edit-member-group.component';

@NgModule({
    imports: [
        MaterialModule,
        MemberGroupSettingRoutingModule,
    ],
    declarations: [
        MemberGroupSettingComponent,
        AddMemberGroupComponent,
        EditMemberGroupComponent
    ],
    entryComponents: [
        AddMemberGroupComponent,
        EditMemberGroupComponent
    ]
})

export class MemberGroupSettingModule {}
