import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_province_url = "/region/provinces";
const provinceUrl = `${baseUrl}${extension_province_url}`;

export function fetchProvinces(search?: string) {
  const params = search ? { search } : {};
  return axios.get(provinceUrl, {
    headers: {
      "Content-Type": "application/json",
    },
    params,
  });
}
