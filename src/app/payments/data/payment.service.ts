import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentModel } from '../models/payment-model';
import { BaseService } from '../../shared/base-service';
import { Observable } from 'rxjs';
import { PaymentStatusModel } from '../models/payment-status.model';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<PaymentModel> {

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'payments');
        this.localHttpClient = httpClient;
    }

    /**
     * Create a new resource
     * @param item
     */
    public approve(item: any): Observable<PaymentStatusModel> {
        const itemUrl = 'approve';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }

    /**
     * Create a new resource
     * @param item
     */
    public cancel(item: any): Observable<PaymentStatusModel> {
        const itemUrl = 'cancel';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }


}
