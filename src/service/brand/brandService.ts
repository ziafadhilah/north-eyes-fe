import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_url = "/brands";
const fullUrl = `${baseUrl}${extension_url}`;

export interface BrandPayload {
  brand_name: string;
  logo_url: string;
  description: string;
  website_url: string;
  email: string;
  phone: string;
  industry: string;
  founded_year: number;
  headquarter_city: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  owner_name: string;
  employee_daily_point: number;
  company_id: number;
}

export function fetchBrands(companyId: string, token: string) {
  const params = new URLSearchParams({ company_id: companyId });

  return axios.get(fullUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createBrands(data: BrandPayload, token: string) {
  return axios.post(fullUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}
