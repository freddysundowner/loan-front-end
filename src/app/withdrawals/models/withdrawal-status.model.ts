import { BaseModel } from '../../shared/models/base-model';

export class WithdrawalStatusModel extends BaseModel {
    id: string;
    withdrawal_status: string;
    cancel_notes: string;
}
