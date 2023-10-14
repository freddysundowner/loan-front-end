import { MemberAreaGeneralJournalService } from './member-area-general-journal.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaGeneralJournalDataSource extends BaseDataSource {
    constructor(service: MemberAreaGeneralJournalService) {
        super(service);
    }
}
