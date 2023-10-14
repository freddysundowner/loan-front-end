import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountingModel } from '../../../accounting/models/accounting-model';
import { BaseService } from '../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class MemberAreaAccountingService extends BaseService<AccountingModel> {

    private  localHttpClient: HttpClient;
    constructor(httpClient: HttpClient) {
        super( httpClient, 'member_accounts');
        this.localHttpClient = httpClient;
    }

    /**
     *
     * @param item
     */
    public getDepositAccountStatement(item: any): Observable<AccountingModel>{
        const itemUrl = 'member';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param item
     */
    public downloadMemberAccountStatement(item: any): Observable<any>{
        const itemUrl = 'member';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }

    /**
     *
     * @param item
     */
    public getLoanAccountStatement(item: any): Observable<AccountingModel>{
        const itemUrl = 'loan';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param item
     */
    public downloadLoanAccountStatement(item: any): Observable<any>{
        const itemUrl = 'loan';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }

    /**
     *
     * @param item
     */
    public getGeneralAccountStatement(item: any): Observable<AccountingModel>{
        const itemUrl = 'general';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     *
     * @param item
     */
    public downloadGeneralAccountStatement(item: any): Observable<any>{
        const itemUrl = 'general';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }
}
