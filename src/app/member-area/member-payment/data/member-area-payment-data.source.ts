import { MemberAreaPaymentService } from './member-area-payment.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaPaymentDataSource extends BaseDataSource {
    constructor(service: MemberAreaPaymentService) {
        super(service);
    }
}
