import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from '../../../shared/base-service';
import { UserProfileModel } from '../../../user-profile/model/user-profile.model';
import { LoanModel } from '../../../loans/models/loan-model';
import { AccountingModel } from '../../../accounting/models/accounting-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaLoanService extends BaseService<LoanModel> {

    private selectedLoanSource = new BehaviorSubject<LoanModel | null>(null);
    selectedLoanChanges$ = this.selectedLoanSource.asObservable();

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'member_loans');
        this.localHttpClient = httpClient;
    }

    changeSelectedLoan(selectedLoan: LoanModel | null ): void {
        this.selectedLoanSource.next(selectedLoan);
    }

    /**
     *
     * @param item
     */
    public getAmortizationStatement(item: any): Observable<AccountingModel>{
        const itemUrl = 'amortization';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param item
     */
    public downloadAmortizationStatement(item: any): Observable<any>{
        const itemUrl = 'amortization';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }

    /**
     *
     * @param item
     */
    public calculatorStatement(item: any): Observable<AccountingModel>{
        const itemUrl = 'calculator';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param item
     */
    public downloadCalculatorStatement(item: any): Observable<any>{
        const itemUrl = 'calculator';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }


}
