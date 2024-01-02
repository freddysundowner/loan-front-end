import { BaseModel } from '../../shared/models/base-model';

export class MemberModel extends BaseModel {
  branch_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  edp_number: string;
  file_number: string;
  nationality: string;
  id_number: string;
  passport_number: string;
  county: string;
  city: string;
  phone: string;
  email: string;
  postal_address: string;
  residential_address: string;
  status_id: string;
  group_id: string;
  password: string;
  password_confirmation: string;

  nx_first_name: string;
  nx_id_number: string;
  nx_nationality: string;
  nx_phone_number: string;
  nx_alt_phone_number: string;
  nx_gender: string;
  nx_relationship: string;
  employment_type: string;
  bs_nature: string;
  bs_location: string;
  stock_level: string;
  bs_start_date: string;

  date_of_birth: string;
  date_of_birth_display: string;
  date_became_member: string;
  date_became_member_display: string;

  photo: File | null;
  national_id_image: File | null;
  membership_form: string;

  created_by: string;
  updated_by: string;

  account: {
    id: string;
    branch_id: string;
    account_number: string;
    account_code: string;
    account_name: string;
    account_type_id: string;
    account_status_id: string;
    other_details: string;
    closed_on: string;
  };
  assets: [];
}
