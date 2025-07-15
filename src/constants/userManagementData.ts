export interface userManagementData {
  full_name: string;
  slug_id: string;
  email: string;
  phone_number: string;
  profile_picture_url: string;
  username: string;
  password: string;
  password_repeat: string;
  company_id: number;
  role: string;
  user_id: string;
}

export interface userManagementCreateData {
  full_name: string;
  slug_id: string;
  email: string;
  phone_number: string;
  profile_picture_url: string;
  username: string;
  password: string;
  password_repeat: string;
  company_id: number;
  role: string;
}

export interface userManagementEditData {
  full_name: string;
  slug_id: string;
  email: string;
  phone_number: string;
  profile_picture_url: string;
  username: string;
  password: string;
  password_repeat: string;
  company_id: number;
  role: string;
  user_id: string;
}
