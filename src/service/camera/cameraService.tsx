import {
  CreateCameraData,
  EditCameraData,
  EditCameraSetting,
} from "@/constants/cameraData";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useEffect, useRef } from "react";
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

export function editCamera(data: EditCameraData, token: string, id: string) {
  return axios.put(`${cameraUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function editSettingsCamera(
  data: EditCameraSetting,
  token: string,
  id: string
) {
  return axios.put(`${cameraUrl}/${id}`, data, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
  });
}

export function fetchSettingsCameraByCameraId(token: string, id: string) {
  const params = new URLSearchParams({ camera_id: id });
  return axios.get(`${cameraUrl}/${id}`, {
    headers: {
      "x-authorized-key": token,
      "Content-Type": "application/json",
    },
    params: params,
  });
}

export function useLiveStream(
  camera_id: string,
  drawImage: (imgData: string) => void
) {
  // console.log(camera_id);
  const socketRef = useRef<Socket | null>(null);
  const webUrl = "https://northeyes-be.ide.asia";
  // const webUrl = "http://68.183.239.230:5001";

  useEffect(() => {
    if (!camera_id || camera_id === "0") return;

    const socket = io(webUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("event", { cmd: "request_streaming", channel: camera_id });
    });

    socket.on("vms_data", (data: string) => {
      const res = JSON.parse(data);
      // console.log(res);
      if (res[0]?.idcamera == camera_id) {
        drawImage(res[0].img);
      }
    });

    return () => {
      if (socket.connected) {
        socket.emit("event", { cmd: "stop_streaming", channel: camera_id });
      }
      socket.disconnect();
    };
  }, [camera_id, drawImage]);
}
