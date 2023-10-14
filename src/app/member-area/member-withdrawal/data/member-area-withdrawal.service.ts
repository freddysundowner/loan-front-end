import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MemberAreaWithdrawalModel } from '../models/member-area-withdrawal-model';
import { Observable } from 'rxjs';
import { MemberAreaWithdrawalStatusModel } from '../models/member-area-withdrawal-status.model';
import { BaseService } from '../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class MemberAreaWithdrawalService extends BaseService<MemberAreaWithdrawalModel> {

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'member_withdrawals');
        this.localHttpClient = httpClient;
    }

    /**
     * Create a new resource
     * @param item
     */
    public approve(item: any): Observable<MemberAreaWithdrawalStatusModel> {
        const itemUrl = 'approve';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public cancel(item: any): Observable<MemberAreaWithdrawalStatusModel> {
        const itemUrl = 'cancel';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }
}
