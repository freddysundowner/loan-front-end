import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MemberAreaPaymentStatusModel } from '../models/member-area-payment-status.model';
import { BaseService } from '../../../shared/base-service';
import { MemberAreaPaymentModel } from '../models/member-area-payment-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaPaymentService extends BaseService<MemberAreaPaymentModel> {

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'member_payments');
        this.localHttpClient = httpClient;
    }

    /**
     * Create a new resource
     * @param item
     */
    public approve(item: any): Observable<MemberAreaPaymentStatusModel> {
        const itemUrl = 'approve';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public cancel(item: any): Observable<MemberAreaPaymentStatusModel> {
        const itemUrl = 'cancel';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }


}
