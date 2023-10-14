import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaLoanService } from './member-area-loan.service';
import { MemberAreaLoanDataSource } from './member-area-loan-data.source';
import { LoanModel } from '../../../loans/models/loan-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaLoanResolverService implements Resolve<LoanModel> {

    dataSource: MemberAreaLoanDataSource;

    constructor(private service: MemberAreaLoanService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanModel {
        return this.service.getAll('', 0, 0);
    }
}
