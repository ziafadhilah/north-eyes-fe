"use client";
import Link from "next/link";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddCameraForm from "./add_camera";
import { CameraData } from "@/constants/cameraData";
import { fetchCameraByAreaId } from "@/service/camera/cameraService";

export default function LIndex() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const brand_name = searchParams.get("brand_name") as string;
  const outlet_name = searchParams.get("outlet_name") as string;
  const area_name = searchParams.get("area_name") as string;
  const [camera, setCamera] = useState<CameraData[]>([]);
  // const [activeTab, setActiveTab] = useState("kitchen");
  // const [mainImage, setMainImage] = useState("/static/images/bg_login.png");
  const [mainImage] = useState("/static/images/bg_login.png");
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (token && companyId && id) {
      fetchCameraByAreaId(token, id)
        .then((res) => {
          console.log(res);
          setCamera(res.data?.data?.data || []);
        })
        .catch((err) => console.error("Error fetching brand:", err));
    }
  }, [id]);

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-black"
            >
              <span
                className="material-symbols-outlined mr-5"
                style={{ fontSize: "32px" }}
              >
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
                    href={`#`}
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

        <div className="ml-10 flex items-center justify-between border-b border-gray-200 mb-5">
          {/* <div className="flex gap-4">
            {["kitchen", "bar", "parking area"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 font-medium capitalize transition duration-200 ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}
          {/* calon komen */}
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

        <div className="ml-10">
          {camera.length > 0 ? (
            camera.map((cam, index) => (
              <div key={cam.camera_id} className="mb-10">
                <p className="font-bold text-black mb-3 text-2xl">
                  Camera {index + 1}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-2 mb-5">
                  <div
                    className="relative w-[110%] rounded-xl shadow-xl h-[100%]"
                    style={{
                      backgroundImage: `url('${cam.thumbnail || mainImage}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <Link
                      href={`/brand/live-preview/${cam.camera_id}/settings`}
                      className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 flex items-center justify-center"
                      style={{ background: "rgba(0, 128, 128, 1)" }}
                      title="Settings"
                    >
                      <span className="material-symbols-outlined text-white">
                        settings
                      </span>
                    </Link>
                  </div>

                  <div className="flex ml-25 flex-col gap-5">
                    <div className="flex gap-3">
                      <Link
                        href={`/brand/live-preview/${cam.camera_id}/suspect`}
                        className="w-full"
                      >
                        <div className="w-[100%] h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-purple">
                          <p className="text-6xl">{cam.suspect_count ?? 0}</p>
                          <span className="text-sm font-normal text-gray-300 mt-2">
                            Suspect
                          </span>
                        </div>
                      </Link>
                      <Link
                        href={`/brand/live-preview/${cam.camera_id}/confirmed`}
                        className="w-full"
                      >
                        <div className="w-[100%] h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-green">
                          <p className="text-6xl">{cam.confirmed_count ?? 0}</p>
                          <span className="text-sm font-normal text-gray-300 mt-2">
                            Confirmed
                          </span>
                        </div>
                      </Link>
                    </div>

                    <div className="w-[100%] h-[260px] p-4 rounded-xl shadow-xl bg-white text-black text-xl font-bold flex flex-col justify-between">
                      <div className="px-5 flex justify-between items-start">
                        <span className="text-lg">Violation</span>
                      </div>

                      <div className="flex justify-around h-full items-center mt-2">
                        <div className="flex flex-col justify-center items-center gap-4">
                          <div className="text-center">
                            <p className="text-5xl text-blue-700">
                              {cam.uniform_violation ?? 0}
                            </p>
                            <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "rgba(212, 175, 55, 1)" }}
                              >
                                person_apron
                              </span>
                              Uniform
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-5xl text-blue-700">
                              {cam.grooming_violation ?? 0}
                            </p>
                            <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "rgba(212, 175, 55, 1)" }}
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
                              {cam.strangers_violation ?? 0}
                            </p>
                            <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "rgba(212, 175, 55, 1)" }}
                              >
                                directions_walk
                              </span>
                              Strangers
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-5xl text-blue-700">
                              {cam.behavior_violation ?? 0}
                            </p>
                            <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "rgba(212, 175, 55, 1)" }}
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
            ))
          ) : (
            <p className="text-gray-500">No camera data found for this area.</p>
          )}
        </div>

        {/* {activeTab === "kitchen" && (
          <>
            <div className="ml-10">
              <p className="font-bold text-black mb-3 text-2xl">Camera 1</p>

              <div className="grid grid-cols-2 lg:grid-cols-2 mb-5">
                <div
                  className="relative w-[110%] rounded-xl shadow-xl h-[100%]"
                  style={{
                    backgroundImage: `url('${mainImage}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Link
                    href={`/brand/live-preview/${camera?.camera_id}/settings`}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 flex items-center justify-center"
                    style={{ background: "rgba(0, 128, 128, 1)" }}
                    title="Settings"
                  >
                    <span className="material-symbols-outlined text-white">
                      settings
                    </span>
                  </Link>
                </div>

                <div className="flex ml-25 flex-col gap-5">
                  <div className="flex gap-3">
                    <Link
                      href={{
                        pathname: `/brand/live-preview/${camera?.camera_id}/suspect`,
                        query: { tab: activeTab },
                      }}
                      className="w-full"
                    >
                      <div className="w-[100%] h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-purple">
                        <p className="text-6xl">15</p>
                        <span className="text-sm font-normal text-gray-300 mt-2">
                          Suspect
                        </span>
                      </div>
                    </Link>
                    <Link
                      href={{
                        pathname: `/brand/live-preview/${camera?.camera_id}/confirmed`,
                        query: { tab: activeTab },
                      }}
                      className="w-full"
                    >
                      <div className="w-[100%] h-[180px] p-4 rounded-xl border-4 flex flex-col justify-center items-center text-white text-xl font-bold bg-linear-green">
                        <p className="text-6xl">10</p>
                        <span className="text-sm font-normal text-gray-300 mt-2">
                          Confirmed
                        </span>
                      </div>
                    </Link>
                  </div>

                  <div className="w-[100%] h-[260px] p-4 rounded-xl shadow-xl bg-white text-black text-xl font-bold flex flex-col justify-between">
                    <div className="px-5 flex justify-between items-start">
                      <span className="text-lg">Violation</span>
                    </div>

                    <div className="flex justify-around h-full items-center mt-2">
                      <div className="flex flex-col justify-center items-center gap-4">
                        <div className="text-center">
                          <p className="text-5xl text-blue-700">1</p>
                          <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "rgba(212, 175, 55, 1)" }}
                            >
                              person_apron
                            </span>
                            Uniform
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-5xl text-blue-700">15</p>
                          <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "rgba(212, 175, 55, 1)" }}
                            >
                              face_5
                            </span>
                            Grooming
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center gap-4">
                        <div className="text-center">
                          <p className="text-5xl text-blue-700">15</p>
                          <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "rgba(212, 175, 55, 1)" }}
                            >
                              directions_walk
                            </span>
                            Strangers
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-5xl text-blue-700">1</p>
                          <p className="text-md text-gray-400 flex items-center justify-center gap-1">
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "rgba(212, 175, 55, 1)" }}
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

              <h1 className="text-2xl font-bold">Other Camera</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-4">
                {[
                  "/static/images/bg_login.png",
                  "/static/images/cam_ex.png",
                  "/static/images/ex_brand.png",
                ].map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(img)}
                    className="rounded-2xl w-full h-[180px] cursor-pointer hover:shadow-lg transition"
                    style={{
                      backgroundImage: `url('${img}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab !== "kitchen" && (
          <div className="mt-10 text-center text-gray-500 text-lg italic">
            Tidak ada data untuk tab {activeTab}
          </div>
        )} */}
      </Main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddCameraForm onClose={closeModal} areaId={id} />
      </Modal>
    </div>
  );
}
