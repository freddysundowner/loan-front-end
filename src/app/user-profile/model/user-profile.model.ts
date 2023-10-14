import { BaseModel } from '../../shared/models/base-model';

export class UserProfileModel extends BaseModel {
    branch: any;
    role: any;
    first_name: string;
    middle_name: string;
    last_name: string;
    file_number: string;
    edp_number: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    physical_address: string;
    postal_address: string;
    postal_code: string;
    photo: string;
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}
