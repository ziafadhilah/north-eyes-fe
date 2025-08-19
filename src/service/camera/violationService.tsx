import { EditViolationDataList } from "@/constants/violationData";
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_violation_url = "violation";
const extension_violation_recap = "violation/recap";
const violationUrl = `${baseUrl}/${extension_violation_url}`;
const violationRecapUrl = `${baseUrl}/${extension_violation_recap}`;

export function getViolationCount(
  token: string,
  company_id: string,
  outlet_id: string
) {
  const params = new URLSearchParams({
    company_id: company_id,
    outlet_id: outlet_id,
  });
  return axios.get(violationRecapUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function getViolationList(
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

export function updateViolationList(
  token: string,
  data: EditViolationDataList[]
) {
  return axios.put(`${violationUrl}/set-suspect`, data, {
    headers: {
      "x-authorized-key": token,
    },
  });
}
