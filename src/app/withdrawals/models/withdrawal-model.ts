import { BaseModel } from '../../shared/models/base-model';

export class WithdrawalModel extends BaseModel {
    member_id: string;
    amount: string;
    withdrawal_date: string;
    disburse_method_id: string;
    withdrawal_number: string;
    withdrawal_charges: string;
    balance_before_withdrawal: string;
    balance_after_withdrawal: string;

    withdrawal_status: string;
    status_color: string;
    status_icon: string;
    pending: string;
    cancel: string;
    approve: string;
    cancel_notes: string;
    cancel_user: any;
    approve_user: any;

    notes: string;

    branch: any;
    member: any;
    paymentMethod: any;

    creator: any;
    updater: any;
    updated_by: string;
    deleted_by: string;
}
