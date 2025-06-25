import { CreateSlugData, EditSlugData } from "@/constants/slugData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_slug_url = "/slugs";
const slugUrl = `${baseUrl}${extension_slug_url}`;

export function fetchSlug(token: string, page: number = 1) {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  return axios.get(slugUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function detailSlug(token: string, id: string) {
  return axios.get(`${slugUrl}/${id}`, {
    headers: { "x-authorized-key": token, "Content-Type": "application/json" },
  });
}

export function createSlug(data: CreateSlugData, token: string) {
  return axios.post(slugUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function updateSlug(data: EditSlugData, token: string, id: string) {
  return axios.put(`${slugUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
      //   "Content-Type": "application/json",
    },
  });
}

export function deleteSlug(token: string, id: string) {
  return axios.delete(`${slugUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
      //   "Content-Type": "application/json",
    },
  });
}
