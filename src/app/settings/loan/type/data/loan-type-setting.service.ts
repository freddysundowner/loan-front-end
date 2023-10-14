import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanTypeSettingModel } from '../model/loan-type-setting.model';
import { BaseService } from '../../../../shared/base-service';
import { Observable } from 'rxjs';
import { LoanTypeDependencyModel } from '../model/loan-type-dependency.model';

@Injectable({ providedIn: 'root' })
export class LoanTypeSettingService extends BaseService<LoanTypeSettingModel> {

    private  localHttpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        super( httpClient, 'loan_types');
        this.localHttpClient = httpClient;
    }

    /**
     * Create a new resource
     * @param item
     */
    public dependencies(item: any): Observable<LoanTypeDependencyModel> {
        const itemUrl = 'dependencies';
        return this.localHttpClient.post<any>(`${super.getResourceUrl()}/${itemUrl}`, item);
    }
}
