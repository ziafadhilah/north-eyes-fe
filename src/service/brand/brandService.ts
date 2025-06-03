import { CreateBrandData } from "@/constants/brandData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_brand_url = "/brands";
const extension_outlet_url = "/outlet";
const brandUrl = `${baseUrl}${extension_brand_url}`;
const outletUrl = `${baseUrl}${extension_outlet_url}`;

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

export function createBrands(data: CreateBrandData, token: string) {
  return axios.post(brandUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}
