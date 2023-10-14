import { Routes, RouterModule } from '@angular/router';
import { MemberAreaWithdrawalComponent } from './member-area-withdrawal.component';

export const ROUTES: Routes = [
    { path: '', component: MemberAreaWithdrawalComponent },
];

export const MemberAreaWithdrawalRoutingModule = RouterModule.forChild(ROUTES);
