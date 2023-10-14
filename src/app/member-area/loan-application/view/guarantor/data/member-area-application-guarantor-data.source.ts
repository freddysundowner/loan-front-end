import { MemberAreaApplicationGuarantorService } from './member-area-application-guarantor.service';
import { BaseDataSource } from '../../../../../shared/base-data-source';

export class MemberAreaApplicationGuarantorDataSource extends BaseDataSource {
    constructor(service: MemberAreaApplicationGuarantorService) {
        super(service);
    }
}
