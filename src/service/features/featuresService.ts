import {
  createFeatureData,
  editFeatureData,
  editFeatureDataStatus,
} from "@/constants/featuresData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const baseUrlFE = "https://northeyes-be.ide.asia/frontend";
const extension_feature_url = "/feature";
const featuresUrl = `${baseUrl}${extension_feature_url}`;

export function fetchFeatures(
  //   companyId: string,
  token: string
  //   page: number = 1
) {
  //   const params = new URLSearchParams({
  //     company_id: companyId,
  //     page: page.toString(),
  //   });

  return axios.get(featuresUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    // params: params,
  });
}

export function detailFeatures(token: string, id: string) {
  return axios.get(`${featuresUrl}/${id}`, {
    headers: { "x-authorized-key": token, "Content-Type": "application/json" },
  });
}

export function createFeatures(data: createFeatureData, token: string) {
  return axios.post(featuresUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function updateFeatures(
  data: editFeatureData,
  token: string,
  id: string
) {
  return axios.put(`${featuresUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function updateFeaturesStatus(
  data: editFeatureDataStatus,
  token: string,
  id: string
) {
  return axios.put(`${featuresUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function deleteFeatures(token: string, id: string) {
  return axios.delete(`${featuresUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
    },
  });
}

export function fetchFeatureFE() {
  return axios.get(`${baseUrlFE}/features`);
}
