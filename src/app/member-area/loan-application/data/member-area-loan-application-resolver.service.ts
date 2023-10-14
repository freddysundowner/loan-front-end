import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaLoanApplicationService } from './member-area-loan-application.service';
import { LoanApplicationModel } from '../../../loan-applications/models/loan-application-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaLoanApplicationResolverService implements Resolve<LoanApplicationModel> {

    loanApplicationId = '';
    id: string;
    loanApp: any;

    constructor(private loanApplicationService: MemberAreaLoanApplicationService) {}

    resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanApplicationModel {

       // console.log('snap...');
       // console.log(snapshot.params.id);
        this.id = snapshot.params.id;

        // If there's data in the loan application service, show it, otherwise fetch from db (This is incase of a page reload)
        this.loanApplicationService.selectedLoanApplicationChanges$.subscribe(data => {
            this.loanApp = data;
        });

        if ( this.loanApp == null) {
         //  console.log('Ftech data from api');
           this.loanApp = this.loanApplicationService.getById(this.id);
        }

        return this.loanApp;
    }
}
