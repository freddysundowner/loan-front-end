import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberAreaLoanService } from './member-area-loan.service';
import { LoanModel } from '../../../loans/models/loan-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaLoanResolverService implements Resolve<LoanModel> {

    loanApplicationId = '';
    id: string;
    loanApp: any;

    constructor(private memberAreaLoanService: MemberAreaLoanService) {}

    resolve(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | LoanModel {

       // console.log('snap...');
       // console.log(snapshot.params.id);
        this.id = snapshot.params.id;

        // If there's data in the loan application service, show it, otherwise fetch from db (This is incase of a page reload)
        this.memberAreaLoanService.selectedLoanChanges$.subscribe(data => {
            this.loanApp = data;
        });

        if ( this.loanApp == null) {
         //  console.log('Ftech data from api');
           this.loanApp = this.memberAreaLoanService.getById(this.id);
        }

        return this.loanApp;
    }
}
