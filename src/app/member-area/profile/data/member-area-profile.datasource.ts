import { MemberAreaProfileService } from './member-area-profile.service';
import { BaseDataSource } from '../../../shared/base-data-source';

export class MemberAreaProfileDataSource extends BaseDataSource {
    constructor(service: MemberAreaProfileService) {
        super(service);
    }
}
