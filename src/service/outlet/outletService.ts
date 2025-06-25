import { CreateOutletData, EditOutletData } from "@/constants/outletData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_outlet_url = "/outlet";
const outletUrl = `${baseUrl}${extension_outlet_url}`;

export function fetchOutletByBrandId(
  token: string,
  id: string,
  page: number = 1
) {
  const params = new URLSearchParams({ brand_id: id, page: page.toString() });
  return axios.get(outletUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createOutlet(data: CreateOutletData, token: string) {
  return axios.post(outletUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function detailOutlet(token: string, id: string) {
  return axios.get(`${outletUrl}/${id}`, {
    headers: { "x-authorized-key": token, "Content-Type": "application/json" },
  });
}

export function updateOutlet(data: EditOutletData, token: string, id: string) {
  return axios.put(`${outletUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function deleteOutlet(token: string, id: string) {
  return axios.delete(`${outletUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
    },
  });
}
