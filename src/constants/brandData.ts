export interface BrandData {
  address: string;
  brand_id: string;
  brand_name: string;
  city: string;
  country: string;
  description: string;
  email: string;
  employee_daily_point: number;
  founded_year: number;
  headquarter_city: string;
  industry: string;
  is_active: boolean;
  logo_url: string;
  owner_name: string;
  phone: string;
  postal_code: string;
  province: string;
  website_url: string;
}

export interface CreateBrandData {
  address: string;
  brand_name: string;
  city: string;
  country: string;
  description: string;
  email: string;
  employee_daily_point: number;
  founded_year: number;
  headquarter_city: string;
  industry: string;
  logo_url: string;
  owner_name: string;
  phone: string;
  postal_code: string;
  province: string;
  website_url: string;
}
