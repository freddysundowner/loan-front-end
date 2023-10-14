import { BaseModel } from '../../../../shared/models/base-model';

export class LoanTypeDependencyModel extends BaseModel {
    interest_types: any;
    payment_frequencies: any;
    penalty_types: any;
    penalty_frequencies: any;
    extra_charges: any;
    charge_types: any;
}
