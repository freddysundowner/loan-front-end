import { Routes, RouterModule } from '@angular/router';
import { MemberAreaComponent } from './member-area.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: MemberAreaComponent
    }
];
export const MemberAreaRoutingModule = RouterModule.forChild(ROUTES);
