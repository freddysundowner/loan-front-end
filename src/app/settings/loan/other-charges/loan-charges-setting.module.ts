import { NgModule } from '@angular/core';

import { LoanChargesSettingRoutingModule } from './loan-charges-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { LoanChargesSettingComponent } from './loan-charges-setting.component';
import { AddLoanChargesComponent } from './add/add-loan-charges.component';
import { EditLoanChargesComponent } from './edit/edit-loan-charges.component';

@NgModule({
    imports: [
        MaterialModule,
        LoanChargesSettingRoutingModule,
    ],
    declarations: [
        LoanChargesSettingComponent,
        AddLoanChargesComponent,
        EditLoanChargesComponent
    ],
    entryComponents: [
        AddLoanChargesComponent,
        EditLoanChargesComponent
    ]
})

export class LoanChargesSettingModule {}
