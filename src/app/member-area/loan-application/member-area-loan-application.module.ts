import { NgModule } from '@angular/core';

import { MemberAreaLoanApplicationRoutingModule } from './member-area-loan-application-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { MemberAreaLoanApplicationComponent } from './member-area-loan-application.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MemberAreaAddLoanApplicationComponent } from './add/member-area-add-loan-application.component';
import { MemberAreaEditLoanApplicationComponent } from './edit/member-area-edit-loan-application.component';
import { MemberAreaViewLoanApplicationComponent } from './view/member-area-view-loan-application.component';
import { MemberAreaViewApplicationGeneralComponent } from './view/general/member-area-view-application-general.component';
import { MemberAreaAddApplicationGuarantorComponent } from './view/guarantor/add/member-area-add-application-guarantor.component';
import { MemberAreaEditApplicationGuarantorComponent } from './view/guarantor/edit/member-area-edit-application-guarantor.component';
import { MemberAreaApplicationGuarantorComponent } from './view/guarantor/member-area-application-guarantor.component';
import { MemberAreaAddApplicationSecurityComponent } from './view/securitty/add/member-area-add-application-security.component';
import { MemberAreaEditApplicationSecurityComponent } from './view/securitty/edit/member-area-edit-application-security.component';
import { MemberAreaApplicationSecurityComponent } from './view/securitty/member-area-application-security.component';

@NgModule({
    imports: [
        MaterialModule,
        MemberAreaLoanApplicationRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        MemberAreaLoanApplicationComponent,
        MemberAreaAddLoanApplicationComponent,
        MemberAreaEditLoanApplicationComponent,
        MemberAreaViewLoanApplicationComponent,
        MemberAreaViewApplicationGeneralComponent,
        MemberAreaAddApplicationGuarantorComponent,
        MemberAreaEditApplicationGuarantorComponent,
        MemberAreaApplicationGuarantorComponent,
        MemberAreaAddApplicationSecurityComponent,
        MemberAreaEditApplicationSecurityComponent,
        MemberAreaApplicationSecurityComponent
    ]
})

export class MemberAreaLoanApplicationModule {}
