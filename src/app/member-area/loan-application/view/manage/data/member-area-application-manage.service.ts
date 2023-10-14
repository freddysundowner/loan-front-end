import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MemberAreaApplicationManageModel } from '../model/member-area-application-manage.model';
import { BaseService } from '../../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class MemberAreaApplicationManageService extends BaseService<MemberAreaApplicationManageModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'payment_methods');
    }
}
