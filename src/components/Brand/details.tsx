/* eslint-disable @next/next/no-img-element */
"use client";
import { brandsData } from "@/constants/dummydata";
import Sidebar from "../General/Layout/Sidebar";
import { useParams } from "next/navigation";
import Link from "next/link";
import Main from "../General/Layout/Main";
import Modal from "../General/Modal/Modal";
import { useState, useEffect, useRef } from "react";
import AddOutletForm from "./add_outlet";

export default function BrandDetails() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const brand = brandsData.find((data) => data.id === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); //
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!brand) {
    return (
      <div className="flex min-h-screen bg-white p-4">
        <Sidebar />
        <div className="flex-1 p-10 text-red-600">
          Brand dengan ID {id} tidak ditemukan.
        </div>
      </div>
    );
  }

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
                List Outlet
              </h1>
              <nav
                className="text-sm text-gray-500 mt-1"
                aria-label="breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  <li className="flex items-center">
                    <Link href="/brand" className="hover:underline">
                      Brand
                    </Link>
                    <span className="material-symbols-outlined mx-2 text-base text-gray-400">
                      chevron_right
                    </span>
                  </li>
                  <li className="text-gray-700 font-medium">{brand.name}</li>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {brand.outlet.map((outletName, outletIndex) => {
            const dropdownId = `${brand.id}-${outletIndex}`; // string

            return (
              <div key={outletIndex} className="relative w-full max-w-sm">
                {/* More Vert Button */}
                <div
                  className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveDropdown(
                      activeDropdown === dropdownId ? null : dropdownId
                    );
                  }}
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </div>

                {/* Dropdown Menu */}
                {activeDropdown === dropdownId && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-10 right-2 bg-white border border-gray-300 shadow-md rounded-md w-32 z-20"
                  >
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        console.log("Edit", outletName.name);
                      }}
                      className="flex items-center w-full gap-2 text-left px-4 py-2 hover:bg-gray-100 text-black"
                    >
                      <span className="material-symbols-outlined">edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setActiveDropdown(null);
                        console.log("Delete", outletName.name);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      <span className="material-symbols-outlined">delete</span>
                      Delete
                    </button>
                  </div>
                )}

                {/* Card Content */}
                <Link
                  href={`outlet/${brand.id}`}
                  passHref
                  className="block p-4 bg-radial-blue rounded-lg shadow-xl flex flex-col items-center justify-center text-center hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-50 h-50 mb-3"
                  />
                  <p className="font-bold text-black">{outletName.name}</p>
                  <p className="text-gray-600">{brand.address}</p>
                </Link>
              </div>
            );
          })}

          {/* Add Outlet Button */}
          <button
            onClick={openModal}
            className="w-full max-w-sm p-4 bg-radial-blue rounded-lg shadow-sm flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-200"
          >
            <div
              className="rounded-2xl text-white shadow-lg w-12 h-12 flex items-center justify-center mb-3 text-2xl transition-transform duration-300 ease-in-out hover:scale-110"
              style={{
                background:
                  "linear-gradient(to bottom,rgba(3, 85, 247, 1), rgba(2, 50, 145, 1))",
              }}
            >
              <span className="material-symbols-outlined">add</span>
            </div>
            <p className="font-bold text-black">Add Outlet</p>
          </button>
        </div>
      </Main>

      {/* Modal Add Outlet */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddOutletForm />
      </Modal>
    </div>
  );
}
