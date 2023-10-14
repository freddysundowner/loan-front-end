import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/base-service';
import { AccountingModel } from '../../../accounting/models/accounting-model';

@Injectable({ providedIn: 'root' })
export class MemberAreaReportService extends BaseService<AccountingModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'reports');
    }
}
