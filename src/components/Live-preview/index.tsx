/* eslint-disable react-hooks/exhaustive-deps */
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
  deleteCamera,
  fetchCameraByAreaId,
  useLiveStream,
} from "@/service/camera/cameraService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { getViolation } from "@/service/camera/violationService";
import { ViolationData } from "@/constants/violationData";
import { useRouter } from "next/navigation";

export default function LIndex() {
  const router = useRouter();
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
  const [violation, setViolation] = useState<ViolationData | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cameraToEdit, setCameraToEdit] = useState<EditCameraData | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState<CameraData | null>(null);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const loadViolation = async () => {
    const token = localStorage.getItem("token") || "";
    const company_id = localStorage.getItem("company_id") || "";

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await getViolation(token, company_id, id);
      if (res.status === 200) {
        setViolation(res.data);
      } else {
        toastr.error("Violation data not found");
      }
    } catch (error) {
      console.error(error);
      toastr.error("Failed to load violation data");
    }
  };

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
          if (cameras.length > 0) {
            setMainCamera(cameras[0]);
            setCamera(cameras.slice(1));
          }
        })
        .catch((err) => console.error("Error fetching camera:", err));
    }
  }, [id]);

  const handleDelete = async (cameraId: string) => {
    const token = localStorage.getItem("token") || "";

    try {
      const res = await deleteCamera(token, cameraId);
      if (res.data.status === "success") {
        toastr.success("Camera deleted successfully");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toastr.error("Failed to delete camera");
      }
    } catch (error) {
      toastr.error("Error occurred while deleting camera");
      console.error(error);
    }
  };

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (token && companyId && id && mainCamera) {
      loadViolation();
    }
  }, [id, mainCamera]);

  return (
    <div>
      <Main>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 w-full gap-4 p-2">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-black hover:scale-110"
              >
                <span className="material-symbols-outlined mr-5 text-3xl">
                  arrow_back
                </span>
              </button>

              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-title-color mb-2">
                  Live Preview
                </h1>
                <nav
                  className="hidden lg:block text-sm text-gray-500 mt-1"
                  aria-label="breadcrumb"
                >
                  <ol className="flex items-center space-x-2">
                    <li>Brand</li>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <li>{brand_name}</li>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <li>{outlet_name}</li>
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                    <li className="text-gray-700 font-medium hover:cursor-default">
                      {area_name}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right p-3">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              {dayName}
            </span>
            <p className="text-md font-medium text-black mt-4">
              {dateTimeString}
            </p>
          </div>
        </div>

        <div className="ml-5 md:mr-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div className="flex justify-start md:justify-start w-full md:w-auto">
            &nbsp;
          </div>
          <div className="flex items-center gap-2 justify-start md:justify-end w-full md:w-auto">
            <button
              onClick={openModal}
              className="text-white p-2 bg-blue-600 rounded-xl shadow-sm flex items-center justify-center hover:scale-102 hover:bg-blue-500"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <span className="text-md font-medium text-black">Add Camera</span>
          </div>
        </div>

        {mainCamera && (
          <div className="p-2">
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
                          href={{
                            pathname: `/brand/live-preview/${mainCamera.camera_id}/settings`,
                            query: {
                              brand_name: brand_name,
                              outlet_name: outlet_name,
                              area_name: area_name,
                              camera_name: mainCamera.camera_name,
                            },
                          }}
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
                      <li>
                        <button
                          onClick={() => {
                            setCameraToDelete(mainCamera);
                            setIsConfirmDeleteOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base mr-2">
                            delete
                          </span>
                          Delete
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
                    {violation && (
                      <div className="h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-purple">
                        <p className="text-6xl">{violation.suspect ?? "-"}</p>
                        <span className="text-sm font-normal text-gray-300 mt-2">
                          Suspect
                        </span>
                      </div>
                    )}
                  </Link>

                  <Link
                    href={`/brand/live-preview/${mainCamera.camera_id}/confirmed`}
                    className="w-full"
                  >
                    {violation && (
                      <div className="h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-green">
                        <p className="text-6xl">{violation.confirmed ?? "-"}</p>
                        <span className="text-sm font-normal text-gray-300 mt-2">
                          Confirmed
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
                {violation && (
                  <div className="p-4 rounded-xl shadow-xl bg-white text-black text-xl font-bold flex flex-col justify-between h-[260px]">
                    <div className="px-5 flex justify-between items-start">
                      <span className="text-lg">Violation</span>
                    </div>
                    <div className="flex justify-around h-full items-center mt-2">
                      <div className="flex flex-col justify-center items-center gap-4">
                        <div className="text-center">
                          <p className="text-5xl text-blue-700">
                            {violation.violations.uniform ?? "-"}
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
                            {violation.violations.grooming ?? "-"}
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
                            {violation.violations.strangers ?? "-"}
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
                            {violation.violations.behaviour ?? "-"}
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
                )}
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

      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        size="sm"
      >
        <h2 className="text-lg font-bold mb-4">Confirm to Delete</h2>
        <p className="mb-4">Are you sure you want to delete this camera?</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-xl"
            onClick={() => setIsConfirmDeleteOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-xl"
            onClick={() => {
              if (cameraToDelete) {
                handleDelete(cameraToDelete.camera_id);
                setIsConfirmDeleteOpen(false);
              }
            }}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
