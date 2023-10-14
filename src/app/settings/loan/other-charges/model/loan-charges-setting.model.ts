import { BaseModel } from '../../../../shared/models/base-model';

export class LoanChargesSettingModel extends BaseModel {
    charge_name: string;
    charge_value: string;
    charge_type_id: string;
    charge_description: string;
    charge_type: any;
}
