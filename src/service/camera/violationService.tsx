import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_violation_url = "violation/recap";
const violationUrl = `${baseUrl}/${extension_violation_url}`;

export function getViolation(
  token: string,
  company_id: string,
  outlet_id: string
) {
  const params = new URLSearchParams({
    company_id: company_id,
    outlet_id: outlet_id,
  });
  return axios.get(violationUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}
