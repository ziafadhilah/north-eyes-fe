import {
  userManagementCreateData,
  userManagementEditData,
} from "@/constants/userManagementData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_user_url = "/users";
const userUrl = `${baseUrl}${extension_user_url}`;

export function fetchUserManagement(token: string, page: number = 1) {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  return axios.get(userUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createUsersManagement(
  data: userManagementCreateData,
  token: string
) {
  return axios.post(userUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function showUsersManagement(token: string, id: string) {
  return axios.get(`${userUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function updateUsersManagement(
  data: userManagementEditData,
  token: string,
  id: string
) {
  return axios.put(`${userUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function deleteUser(token: string, id: string) {
  return axios.delete(`${userUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
    },
  });
}
