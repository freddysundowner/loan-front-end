import { MemberAreaWithdrawalService } from './member-area-withdrawal.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaWithdrawalDataSource extends BaseDataSource {
    constructor(service: MemberAreaWithdrawalService) {
        super(service);
    }
}
