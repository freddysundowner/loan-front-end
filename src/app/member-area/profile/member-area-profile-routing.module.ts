import { Routes, RouterModule } from '@angular/router';
import { MemberAreaProfileComponent } from './member-area-profile.component';
import { UserProfileResolverService } from '../../user-profile/data/user-profile-resolver.service';
import { MemberAreaProfileResolverService } from './data/member-area-profile-resolver.service';

export const ROUTES: Routes = [
    {
        path: '',
        component: MemberAreaProfileComponent,
        resolve : { profile: MemberAreaProfileResolverService}
    }
];

export const MemberAreaProfileRoutingModule = RouterModule.forChild(ROUTES);
