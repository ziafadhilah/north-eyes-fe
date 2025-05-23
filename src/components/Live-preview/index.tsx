"use client";
import Link from "next/link";
import Main from "../General/Layout/Main";
import Modal from "../General/Modal/Modal";
import { useParams } from "next/navigation";
import { useState } from "react";
import { brandsData } from "@/constants/dummydata";
import AddCameraForm from "./add_camera";

export default function LIndex() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const brand = brandsData.find((data) => data.id === id);
  const [activeTab, setActiveTab] = useState("kitchen");
  const [mainImage, setMainImage] = useState("/static/images/bg_login.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <button className="flex items-center text-black">
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
                  <Link
                    href={`/brand/${brand?.id}`}
                    className="hover:underline"
                  >
                    {brand?.name}
                  </Link>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <Link
                    href={`/brand/${brand?.id}`}
                    className="hover:underline"
                  >
                    {brand?.outlet[0].name}
                  </Link>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">Live View</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              Wednesday
            </span>
            <p className="text-md font-medium text-black mt-4">
              10:00 AM, 04 April 2025
            </p>
          </div>
        </div>

        <div className="ml-10 flex items-center justify-between border-b border-gray-200 mb-5">
          <div className="flex gap-4">
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
          </div>
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

        {activeTab === "kitchen" && (
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
                    href={`/brand/live-preview/${brand?.id}/settings`}
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
                        pathname: `/brand/live-preview/${brand?.id}/suspect`,
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
                        pathname: `/brand/live-preview/${brand?.id}/confirmed`,
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

              {/* Gambar tambahan */}
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
        )}
      </Main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddCameraForm />
      </Modal>
    </div>
  );
}
