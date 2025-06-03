import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_brand_url = "/brands";
const extension_outlet_url = "/outlet";
const brandUrl = `${baseUrl}${extension_brand_url}`;
const outletUrl = `${baseUrl}${extension_outlet_url}`;

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

export function fetchBrands(
  companyId: string,
  token: string,
  page: number = 1
) {
  const params = new URLSearchParams({
    company_id: companyId,
    page: page.toString(),
  });

  return axios.get(brandUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function fetchBrandsById(token: string, id: string) {
  const params = new URLSearchParams({ brand_id: id });
  return axios.get(outletUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createBrands(data: BrandPayload, token: string) {
  return axios.post(brandUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}
