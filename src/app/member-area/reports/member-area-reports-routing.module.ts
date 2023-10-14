import { Routes, RouterModule } from '@angular/router';
import { MemberAreaReportsComponent } from './member-area-reports.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: MemberAreaReportsComponent
    }
];

export const MemberAreaReportsRoutingModule = RouterModule.forChild(ROUTES);
