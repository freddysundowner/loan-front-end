import { Routes, RouterModule } from '@angular/router';
import { CommunicationSettingComponent } from './communication-setting.component';
import { EmailSettingResolverService } from './email/data/email-setting-resolver.service';
import { SmsSettingResolverService } from './sms/data/sms-setting-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: CommunicationSettingComponent,
        children: [
            {
                path: '',
              //  loadChildren: 'app/settings/communication/general/communication-general-setting.module#CommunicationGeneralSettingModule'
                loadChildren: () => import('app/settings/communication/general/communication-general-setting.module').then(m => m.CommunicationGeneralSettingModule)
            },
           {
                path: 'email',
              //  loadChildren: 'app/settings/communication/email/email-setting.module#EmailSettingModule',
               loadChildren: () => import('app/settings/communication/email/email-setting.module').then(m => m.EmailSettingModule),
               resolve : { setting: EmailSettingResolverService}
           },
            {
                path: 'sms',
               // loadChildren: 'app/settings/communication/sms/sms-setting.module#SmsSettingModule',
                loadChildren: () => import('app/settings/communication/sms/sms-setting.module').then(m => m.SmsSettingModule),
                resolve : { setting: SmsSettingResolverService}
            },
            {
                path: 'email_templates',
               // loadChildren: 'app/settings/communication/email-template/email-template-setting.module#EmailTemplateSettingModule'
                loadChildren: () => import('app/settings/communication/email-template/email-template-setting.module').then(m => m.EmailTemplateSettingModule)
            },
            {
                path: 'sms_templates',
              //  loadChildren: 'app/settings/communication/sms-template/sms-template-setting.module#SmsTemplateSettingModule'
                loadChildren: () => import('app/settings/communication/sms-template/sms-template-setting.module').then(m => m.SmsTemplateSettingModule)
            }
        ]
    }
];

export const CommunicationSettingRoutingModule = RouterModule.forChild(ROUTES);
