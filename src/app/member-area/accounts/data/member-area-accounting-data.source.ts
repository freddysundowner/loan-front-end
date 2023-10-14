import { MemberAreaAccountingService } from './member-area-accounting.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaAccountingDataSource extends BaseDataSource {
    constructor(service: MemberAreaAccountingService) {
        super(service);
    }
}
