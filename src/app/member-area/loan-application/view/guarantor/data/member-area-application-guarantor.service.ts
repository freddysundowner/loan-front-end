import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../../../shared/base-service';
import { ApplicationGuarantorModel } from '../../../../../loan-applications/view/guarantor/model/application-guarantor.model';

@Injectable({ providedIn: 'root' })
export class MemberAreaApplicationGuarantorService extends BaseService<ApplicationGuarantorModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'guarantors');
    }
}
