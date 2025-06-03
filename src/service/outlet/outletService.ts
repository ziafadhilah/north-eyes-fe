import { CreateOutletData } from "@/constants/outletData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_outlet_url = "/outlet";
const outletUrl = `${baseUrl}${extension_outlet_url}`;

export function fetchOutletByBrandId(token: string, id: string) {
  const params = new URLSearchParams({ brand_id: id });
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
