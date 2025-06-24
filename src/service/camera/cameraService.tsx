import { CreateCameraData } from "@/constants/cameraData";
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

export function useLiveStream(
  camera_id: string,
  drawImage: (imgData: string) => void,
  cameraUrl1: string
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    const socket = io(cameraUrl1);

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("event", { cmd: "request_streaming", camera_id });
    });

    socket.on("vms_data", (data) => {
      const res = JSON.parse(data);
      console.log(res);
      const img = new Image();
      img.src = res?.image;
      img.onload = () => {
        ctx?.clearRect(0, 0, 500, 300); // optional
        ctx?.drawImage(img, 0, 0, 500, 300);
      };
      // if (res[0]?.idcamera === camera_id) {
      // }
    });

    return () => {
      if (socket.connected) {
        socket.emit("event", { cmd: "stop_streaming", camera_id });
      }
      socket.disconnect();
    };
  }, [cameraUrl1, camera_id, drawImage]);

  return canvasRef;
}
