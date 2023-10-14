import { BaseModel } from '../../../shared/models/base-model';

export class MemberAreaPaymentStatusModel extends BaseModel {
    id: string;
    payment_status: string;
    cancel_notes: string;
}
