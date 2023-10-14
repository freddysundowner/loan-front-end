import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaAccountingService } from './member-area-accounting.service';
import { MemberAreaAccountingDataSource } from './member-area-accounting-data.source';
import { AccountingModel } from '../../../accounting/models/accounting-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaAccountingResolverService implements Resolve<AccountingModel> {

    dataSource: MemberAreaAccountingDataSource;

    constructor(private service: MemberAreaAccountingService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | AccountingModel {

        return this.service.getAll('', 0, 0);
    }
}
