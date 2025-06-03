export interface OutletData {
  outlet_id: string;
  outlet_name: string;
  logo_url: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  brand_id: string;
}

export interface CreateOutletData {
  outlet_name: string;
  logo_url: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  brand_id: string;
}
