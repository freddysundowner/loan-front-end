import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaProfileService } from './member-area-profile.service';
import { UserProfileModel } from '../../../user-profile/model/user-profile.model';

@Injectable({ providedIn: 'root' })
export class MemberAreaProfileResolverService implements Resolve<UserProfileModel> {

    constructor(private service: MemberAreaProfileService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | UserProfileModel {
        return this.service.getAll('', 1, 1);
    }
}
