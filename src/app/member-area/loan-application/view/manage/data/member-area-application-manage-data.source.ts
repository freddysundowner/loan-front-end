import { MemberAreaApplicationManageService } from './member-area-application-manage.service';
import { BaseDataSource } from '../../../../../shared/base-data-source';

export class MemberAreaApplicationManageDataSource extends BaseDataSource {
    constructor(service: MemberAreaApplicationManageService) {
        super(service);
    }
}
