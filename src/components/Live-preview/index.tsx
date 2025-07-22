"use client";
import Link from "next/link";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AddCameraForm from "./add_camera";
import { EditCameraForm } from "./edit";
import { CameraData, EditCameraData } from "@/constants/cameraData";
import {
  fetchCameraByAreaId,
  useLiveStream,
} from "@/service/camera/cameraService";

export default function LIndex() {
  const [isLoading, setIsLoading] = useState(true);
  const [isStreamingActive, setIsStreamingActive] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const brand_name = searchParams.get("brand_name") as string;
  const outlet_name = searchParams.get("outlet_name") as string;
  const area_name = searchParams.get("area_name") as string;
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [camera, setCamera] = useState<CameraData[]>([]);
  const [mainCamera, setMainCamera] = useState<CameraData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cameraToEdit, setCameraToEdit] = useState<EditCameraData | null>(null);

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
    const img = new Image();
    img.src = "data:image/jpeg;base64," + imgData;
    img.onload = () => {
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx?.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      setIsLoading(false);
    };
  }, []);

  useLiveStream(
    isStreamingActive && mainCamera ? mainCamera.camera_id : "0",
    drawImage
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (token && companyId && id) {
      fetchCameraByAreaId(token, id)
        .then((res) => {
          const cameras = res.data?.data?.data || [];
          console.log("Data Kamera :", res);
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
    setIsLoading(true);
    setIsStreamingActive(true);
  };

  const openEditModal = (camera: CameraData) => {
    setCameraToEdit(camera);
    setActiveDropdown(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCameraToEdit(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

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
          <div>
            <p className="font-bold text-black mb-3 text-2xl">
              {mainCamera.camera_name}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              <div className="rounded-xl shadow-xl w-full h-[450px] relative">
                {isLoading ? (
                  <div className="w-full h-full flex justify-center items-center bg-gray-200 rounded-xl">
                    <span className="material-symbols-outlined animate-spin text-4xl text-blue-600">
                      progress_activity
                    </span>
                    <span className="ml-2 text-blue-600 font-medium">
                      Loading live stream...
                    </span>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="rounded-xl w-full h-full"
                  ></canvas>
                )}
                <div
                  className="absolute top-3 right-3 bg-teal-600 p-2 rounded-full shadow-md hover:bg-teal-500 flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveDropdown(
                      activeDropdown === mainCamera.camera_id
                        ? null
                        : mainCamera.camera_id
                    );
                  }}
                >
                  <span className="material-symbols-outlined text-white">
                    settings
                  </span>
                </div>
                {activeDropdown === mainCamera.camera_id && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-10 right-2 bg-white border border-gray-300 shadow-md rounded-md w-32 z-20"
                  >
                    <ul className="flex flex-col">
                      <li>
                        <Link
                          href={`/brand/live-preview/${mainCamera.camera_id}/settings`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="material-symbols-outlined text-base mr-2 align-middle">
                            settings
                          </span>
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => openEditModal(mainCamera)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base mr-2">
                            edit
                          </span>
                          Edit
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                {/* <Link
                  href={`/brand/live-preview/${mainCamera.camera_id}/settings`}
                  className="absolute top-3 right-3 bg-teal-600 p-2 rounded-full shadow-md hover:bg-teal-500 flex items-center justify-center"
                  title="Settings"
                >
                  <span className="material-symbols-outlined text-white">
                    settings
                  </span>
                </Link> */}
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  <Link
                    href={`/brand/live-preview/${mainCamera.camera_id}/suspect`}
                    className="w-full"
                  >
                    <div className="h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-purple">
                      <p className="text-6xl">
                        {mainCamera.suspect_count ?? 0}
                      </p>
                      <span className="text-sm font-normal text-gray-300 mt-2">
                        Suspect
                      </span>
                    </div>
                  </Link>

                  <Link
                    href={`/brand/live-preview/${mainCamera.camera_id}/confirmed`}
                    className="w-full"
                  >
                    <div className="h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-green">
                      <p className="text-6xl">
                        {mainCamera.confirmed_count ?? 0}
                      </p>
                      <span className="text-sm font-normal text-gray-300 mt-2">
                        Confirmed
                      </span>
                    </div>
                  </Link>
                </div>
                <div className="p-4 rounded-xl shadow-xl bg-white text-black text-xl font-bold flex flex-col justify-between h-[260px]">
                  <div className="px-5 flex justify-between items-start">
                    <span className="text-lg">Violation</span>
                  </div>
                  <div className="flex justify-around h-full items-center mt-2">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <div className="text-center">
                        <p className="text-5xl text-blue-700">
                          {mainCamera.uniform_violation ?? 0}
                        </p>
                        <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#D4AF37" }}
                          >
                            person_apron
                          </span>
                          Uniform
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-5xl text-blue-700">
                          {mainCamera.grooming_violation ?? 0}
                        </p>
                        <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#D4AF37" }}
                          >
                            face_5
                          </span>
                          Grooming
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                      <div className="text-center">
                        <p className="text-5xl text-blue-700">
                          {mainCamera.strangers_violation ?? 0}
                        </p>
                        <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#D4AF37" }}
                          >
                            directions_walk
                          </span>
                          Strangers
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-5xl text-blue-700">
                          {mainCamera.behavior_violation ?? 0}
                        </p>
                        <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                          <span
                            className="material-symbols-outlined"
                            style={{ color: "#D4AF37" }}
                          >
                            accessible_menu
                          </span>
                          Behavior
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {[mainCamera, ...camera].length > 0 && (
          <div className="px-2 lg:px-0 w-full">
            <h2 className="text-xl font-semibold text-black mb-4">
              Other Cameras
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-4">
              {[mainCamera, ...camera].map((cam) => {
                if (!cam) return null;
                const isActive = cam.camera_id === mainCamera?.camera_id;

                return (
                  <div
                    key={cam.camera_id}
                    onClick={() => !isActive && handleMainCameraSwap(cam)}
                    className={`relative rounded-2xl w-full h-[180px] cursor-pointer hover:shadow-lg transition ${
                      isActive
                        ? "border-4 border-blue-600 pointer-events-none"
                        : ""
                    }`}
                    style={{
                      backgroundImage: `url('${
                        cam.thumbnail || "/static/images/bg_login.png"
                      }')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    title={cam.camera_name}
                  >
                    {isActive && (
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddCameraForm onClose={closeModal} areaId={id} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {cameraToEdit ? (
          <EditCameraForm cameraData={cameraToEdit} onClose={closeEditModal} />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
}
