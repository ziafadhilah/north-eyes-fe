import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_regency_url = "/region/regencies";
const regencyUrl = `${baseUrl}${extension_regency_url}`;

export function fetchRegencies(provinceId: number | string, search?: string) {
  const params = search ? { search } : {};

  return axios.get(`${regencyUrl}/${provinceId}`, {
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      page: 1,
      ...params,
    },
  });
}
