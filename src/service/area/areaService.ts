import { CreateAreaData } from "@/constants/areaData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_area_url = "/area";
const areaUrl = `${baseUrl}${extension_area_url}`;

export function fetchareaByOutletId(token: string, id: string) {
  const params = new URLSearchParams({ outlet_id: id });
  return axios.get(areaUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createArea(data: CreateAreaData, token: string) {
  return axios.post(areaUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}
