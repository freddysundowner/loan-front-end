import { MemberAreaLoanApplicationService } from './member-area-loan-application.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaLoanApplicationDataSource extends BaseDataSource {
    constructor(service: MemberAreaLoanApplicationService) {
        super(service);
    }
}
