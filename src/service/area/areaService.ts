import { CreateAreaData, EditAreaData } from "@/constants/areaData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_area_url = "/area";
const areaUrl = `${baseUrl}${extension_area_url}`;

export function fetchareaByOutletId(
  token: string,
  id: string,
  page: number = 1
) {
  const params = new URLSearchParams({ outlet_id: id, page: page.toString() });
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

export function detailAreas(token: string, id: string) {
  return axios.get(`${areaUrl}/${id}`, {
    headers: { "x-authorized-key": token, "Content-Type": "application/json" },
  });
}

export function updateAreas(data: EditAreaData, token: string, id: string) {
  return axios.put(`${areaUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function deleteArea(token: string, id: string) {
  return axios.delete(`${areaUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
    },
  });
}
