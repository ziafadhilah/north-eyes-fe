/* eslint-disable @next/next/no-img-element */
"use client";
import { brandsData } from "@/constants/dummydata";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Main from "@/components/General/Layout/Main";
import AddOutletForm from "./add_area";
import Modal from "../General/Modal/Modal";

export default function OIndex() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const brand = brandsData.find((data) => data.id === id);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
              <h1 className="text-3xl font-bold text-title-color mb-2">Area</h1>
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
                  <li>
                    <Link
                      href={`/brand/${brand?.id}`}
                      className="hover:underline"
                    >
                      {brand?.name}
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">
                    {brand?.outlet[1].name}
                  </li>
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
          {brand?.kitchen.map((kitchen, index) => (
            <div key={kitchen.id} className="relative w-full max-w-sm">
              <Link
                key={index}
                href={`/brand/live-preview/${brand.id}`}
                passHref
                className="w-full max-w-sm p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center bg-radial-blue"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-50 h-50 mb-3"
                />
                <p className="font-bold text-black">{kitchen.name}</p>
                <p className="text-gray-600">{brand.address}</p>
              </Link>

              <div
                className="absolute top-5 right-1 text-gray-600 hover:text-black cursor-pointer z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveDropdown(
                    activeDropdown === kitchen.id ? null : kitchen.id
                  );
                }}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </div>

              {activeDropdown === kitchen.id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-10 right-2 bg-white border border-gray-300 shadow-md rounded-md w-32 z-20"
                >
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      console.log("Edit", kitchen.name);
                    }}
                    className="flex items-center w-full gap-2 text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    <span className="material-symbols-outlined">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      console.log("Delete", kitchen.name);
                    }}
                    className="flex items-center w-full gap-2 text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
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
            <p className="font-bold text-black">Add Area</p>
          </button>
        </div>
      </Main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddOutletForm />
      </Modal>
    </div>
  );
}
