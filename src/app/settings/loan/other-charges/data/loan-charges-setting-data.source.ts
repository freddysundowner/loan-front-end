import { BaseDataSource } from '../../../../shared/base-data-source';
import { LoanChargesSettingService } from './loan-charges-setting.service';

export class LoanChargesSettingDataSource extends BaseDataSource {
    constructor(service: LoanChargesSettingService) {
        super(service);
    }
}
