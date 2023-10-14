import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WithdrawalModel } from '../models/withdrawal-model';
import { BaseService } from '../../shared/base-service';
import { Observable } from 'rxjs';
import { WithdrawalStatusModel } from '../models/withdrawal-status.model';

@Injectable({ providedIn: 'root' })
export class WithdrawalService extends BaseService<WithdrawalModel> {

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'withdrawals');
        this.localHttpClient = httpClient;
    }

    /**
     * Create a new resource
     * @param item
     */
    public approve(item: any): Observable<WithdrawalStatusModel> {
        const itemUrl = 'approve';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public cancel(item: any): Observable<WithdrawalStatusModel> {
        const itemUrl = 'cancel';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }
}
