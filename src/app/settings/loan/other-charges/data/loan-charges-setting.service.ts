import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoanChargesSettingModel } from '../model/loan-charges-setting.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class LoanChargesSettingService extends BaseService<LoanChargesSettingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'extra_charges');
    }
}
