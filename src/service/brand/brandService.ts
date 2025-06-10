import { CreateBrandData, EditBrandData } from "@/constants/brandData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_brand_url = "/brands";
const brandUrl = `${baseUrl}${extension_brand_url}`;

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

export function detailBrands(token: string, id: string) {
  return axios.get(`${brandUrl}/${id}`, {
    headers: { "x-authorized-key": token, "Content-Type": "application/json" },
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

export function updateBrands(data: EditBrandData, token: string, id: string) {
  return axios.put(`${brandUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function deleteBrands(token: string, id: string) {
  return axios.delete(`${brandUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
    },
  });
}
