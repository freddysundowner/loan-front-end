import { Routes, RouterModule } from '@angular/router';
import { MemberAreaApplicationManageComponent } from './member-area-application-manage.component';

export const ROUTES: Routes = [
    { path: '', component: MemberAreaApplicationManageComponent }
];
export const ApplicationManageRoutingModule = RouterModule.forChild(ROUTES);
