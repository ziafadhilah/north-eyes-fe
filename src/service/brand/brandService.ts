import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_url = "/brands";
const fullUrl = `${baseUrl}${extension_url}`;

export function fetchBrands(companyId: string, token: string) {
  const params = new URLSearchParams({ company_id: companyId });

  return axios.get(fullUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createBrands(data: any, token: string) {
  return axios.post(fullUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}
