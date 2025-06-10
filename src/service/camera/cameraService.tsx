import { CreateCameraData } from "@/constants/cameraData";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
const extension_camera_url = "/camera";
const cameraUrl = `${baseUrl}${extension_camera_url}`;

export function fetchCameraByAreaId(token: string, id: string) {
  const params = new URLSearchParams({ area_id: id });
  return axios.get(cameraUrl, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function createCamera(data: CreateCameraData, token: string) {
  return axios.post(cameraUrl, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}
