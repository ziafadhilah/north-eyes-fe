"use client";
import Link from "next/link";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AddCameraForm from "./add_camera";
import { CameraData } from "@/constants/cameraData";
import {
  fetchCameraByAreaId,
  useLiveStream,
} from "@/service/camera/cameraService";

export default function LIndex() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const brand_name = searchParams.get("brand_name") as string;
  const outlet_name = searchParams.get("outlet_name") as string;
  const area_name = searchParams.get("area_name") as string;

  const [camera, setCamera] = useState<CameraData[]>([]);
  const [mainCamera, setMainCamera] = useState<CameraData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = useCallback((imgData: string) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.src = "data:image/jpeg;base64," + imgData;
      img.onload = () => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      };
    }
  }, []);

  useLiveStream(
    mainCamera ? mainCamera.camera_id : "0",
    drawImage,
    "http://68.183.239.230:5001"
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (token && companyId && id) {
      fetchCameraByAreaId(token, id)
        .then((res) => {
          const cameras = res.data?.data?.data || [];
          if (cameras.length > 0) {
            setMainCamera(cameras[0]);
            setCamera(cameras.slice(1));
          }
        })
        .catch((err) => console.error("Error fetching brand:", err));
    }
  }, [id]);

  const handleMainCameraSwap = (clickedCamera: CameraData) => {
    if (!mainCamera) return;

    const updatedCameraList = [
      mainCamera,
      ...camera.filter((cam) => cam.camera_id !== clickedCamera.camera_id),
    ];
    setMainCamera(clickedCamera);
    setCamera(updatedCameraList);
  };

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-black hover:scale-110"
            >
              <span className="material-symbols-outlined mr-5 text-3xl">
                arrow_back
              </span>
            </button>

            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Live Preview
              </h1>
              <nav
                className="text-sm text-gray-500 mt-1"
                aria-label="breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/brand" className="hover:underline">
                      Brand
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li>{brand_name}</li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <Link
                    href="#"
                    onClick={() => window.history.back()}
                    className="hover:underline"
                  >
                    {outlet_name}
                  </Link>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">{area_name}</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              {dayName}
            </span>
            <p className="text-md font-medium text-black mt-4">
              {dateTimeString}
            </p>
          </div>
        </div>

        <div className="ml-10 flex items-center justify-between mb-5">
          <div className="flex gap-4">&nbsp;</div>
          <div className="flex items-center gap-2">
            <button
              onClick={openModal}
              className="text-white p-2 bg-blue-600 rounded-xl shadow-sm flex items-center justify-center hover:scale-105 hover:bg-blue-500"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <span className="text-md font-medium text-black">Add Camera</span>
          </div>
        </div>

        {mainCamera && (
          <div className="ml-10 mb-10">
            <p className="font-bold text-black mb-3 text-2xl">
              {mainCamera.camera_name}
            </p>
            <div className="rounded-xl shadow-xl w-full h-[400px] relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="rounded-xl w-full h-full"
              ></canvas>
              <Link
                href={`/brand/live-preview/${mainCamera.camera_id}/settings`}
                className="absolute top-3 right-3 bg-teal-600 p-2 rounded-full shadow-md hover:bg-teal-500 flex items-center justify-center"
                title="Settings"
              >
                <span className="material-symbols-outlined text-white">
                  settings
                </span>
              </Link>
            </div>
          </div>
        )}

        {camera.length > 0 && (
          <div className="ml-10">
            <h2 className="text-xl font-semibold text-black mb-4">
              Other Cameras
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-4">
              {camera.map((cam) => (
                <div
                  key={cam.camera_id}
                  onClick={() => handleMainCameraSwap(cam)}
                  className="rounded-2xl w-full h-[180px] cursor-pointer hover:shadow-lg transition"
                  style={{
                    backgroundImage: `url('${
                      cam.thumbnail || "/static/images/bg_login.png"
                    }')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  title={cam.camera_name}
                ></div>
              ))}
            </div>
          </div>
        )}
      </Main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddCameraForm onClose={closeModal} areaId={id} />
      </Modal>
    </div>
  );
}
