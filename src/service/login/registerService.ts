import { RegisterData } from "@/constants/registerData";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_register_url = "/users/register";
const registerUrl = `${baseUrl}${extension_register_url}`;

export function registerUser(data: RegisterData) {
  return axios.post(registerUrl, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
