import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceFeeTypeModel } from '../../type/model/service-fee-type.model';
import { BaseService } from '../../../../shared/base-service';

@Injectable({ providedIn: 'root' })
export class ChargeTypeService extends BaseService<ServiceFeeTypeModel> {
    constructor(httpClient: HttpClient) {
        super( httpClient, 'charge_types');
    }
}
