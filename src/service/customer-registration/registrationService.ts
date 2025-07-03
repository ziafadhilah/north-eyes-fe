import { RegisterData } from "@/constants/registerData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_registration_url = "/registration";
const registrationUrl = `${baseUrl}${extension_registration_url}`;

export function fetchRegistration(token: string, page: number = 1) {
  const params = new URLSearchParams({
    page: page.toString(),
  });
  return axios.get(registrationUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function registrationUser(data: RegisterData) {
  return axios.post(registrationUrl, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
