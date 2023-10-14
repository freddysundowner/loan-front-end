import { Routes, RouterModule } from '@angular/router';
import { LoanChargesSettingComponent } from './loan-charges-setting.component';

export const ROUTES: Routes = [
    { path: '', component: LoanChargesSettingComponent },
];

export const LoanChargesSettingRoutingModule = RouterModule.forChild(ROUTES);
