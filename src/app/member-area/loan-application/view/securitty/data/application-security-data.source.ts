import { ApplicationSecurityService } from './application-security.service';
import { BaseDataSource } from '../../../../../shared/base-data-source';

export class ApplicationSecurityDataSource extends BaseDataSource {
    constructor(service: ApplicationSecurityService) {
        super(service);
    }
}
