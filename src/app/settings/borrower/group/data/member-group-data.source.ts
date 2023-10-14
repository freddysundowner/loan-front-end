import { MemberGroupService } from './member-group.service';
import { BaseDataSource } from '../../../../shared/base-data-source';

export class MemberGroupDataSource extends BaseDataSource {
    constructor(service: MemberGroupService) {
        super(service);
    }
}
