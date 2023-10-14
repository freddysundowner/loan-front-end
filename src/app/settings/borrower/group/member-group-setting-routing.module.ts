import { Routes, RouterModule } from '@angular/router';
import { MemberGroupSettingComponent } from './member-group-setting.component';

export const ROUTES: Routes = [
    { path: '', component: MemberGroupSettingComponent },
];

export const MemberGroupSettingRoutingModule = RouterModule.forChild(ROUTES);
