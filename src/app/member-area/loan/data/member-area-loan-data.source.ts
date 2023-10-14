import { MemberAreaLoanService } from './member-area-loan.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaLoanDataSource extends BaseDataSource {
    constructor(service: MemberAreaLoanService) {
        super(service);
    }
}
