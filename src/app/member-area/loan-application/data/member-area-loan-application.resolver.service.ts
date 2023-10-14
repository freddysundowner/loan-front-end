import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaLoanApplicationService } from './member-area-loan-application.service';
import { MemberAreaLoanApplicationDataSource } from './member-area-loan-application-data.source';
import { LoanApplicationModel } from '../../../loan-applications/models/loan-application-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaLoanApplicationResolverService implements Resolve<LoanApplicationModel> {

    dataSource: MemberAreaLoanApplicationDataSource;

    constructor(private service: MemberAreaLoanApplicationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanApplicationModel {
        return this.service.getAll('', 0, 0);
    }
}
