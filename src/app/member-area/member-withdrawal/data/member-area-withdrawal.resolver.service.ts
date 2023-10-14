import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaWithdrawalModel } from '../models/member-area-withdrawal-model';
import { MemberAreaWithdrawalService } from './member-area-withdrawal.service';
import { MemberAreaWithdrawalDataSource } from './member-area-withdrawal-data.source';

@Injectable({ providedIn: 'root' })
export class MemberAreaWithdrawalResolverService implements Resolve<MemberAreaWithdrawalModel> {

    dataSource: MemberAreaWithdrawalDataSource;

    constructor(private service: MemberAreaWithdrawalService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | MemberAreaWithdrawalModel {
        return this.service.getAll('', 0, 0);
    }
}
