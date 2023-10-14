import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinanceStatementModel } from '../../../accounting/models/finance-statement.model';
import { BaseService } from '../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class MemberAreaFinanceStatementService extends BaseService<FinanceStatementModel> {

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'finance_statements');
        this.localHttpClient = httpClient;
    }

    /**
     *
     * @param item
     */
    public downloadReport(item: any): Observable<any>{
        const itemUrl = 'report';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item, { responseType: 'blob' as 'json'});
    }
}
