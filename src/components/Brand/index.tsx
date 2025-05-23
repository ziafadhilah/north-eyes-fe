/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AddBrandForm from "./add_brand";
import { BrandData } from "@/constants/brandData";
import { fetchBrands } from "@/service/brand/brandService";

export default function BrandPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  const [companyName, setCompanyName] = useState("");
  const [brands, setBrands] = useState<BrandData[]>([]);

  useEffect(() => {
    const companyData = localStorage.getItem("company");
    const companyIdData = localStorage.getItem("company_id");
    const token = localStorage.getItem("token");
    if (!companyData || !token) {
      router.push("/login");
      return;
    }

    setCompanyName(companyData || "Group Name");

    fetchBrands(companyIdData || "", token)
      .then((response) => {
        setBrands(response.data?.data?.data || []);
      })
      .catch((error) => {
        console.error("Error saat mengambil brand:", error);
      });
  }, []);

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
            <div></div>
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2 uppercase">
                {companyName || "Group Name"}
              </h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {brands.map((data) => (
            <div key={data.brand_id} className="relative w-full max-w-sm">
              <Link
                href={`brand/${data.brand_id}`}
                className="p-4 cursor-pointer rounded-lg shadow-sm flex flex-col items-center justify-center text-center bg-radial-blue transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-200"
              >
                <img
                  src={
                    data.logo_url
                      ? data.logo_url
                      : "/static/images/ex_brand.png"
                  }
                  alt={data.brand_name}
                  className="w-50 h-50 mb-3"
                />
                <p className="font-bold text-black">{data.brand_name}</p>
              </Link>

              <div
                className="absolute top-5 right-1 text-gray-600 hover:text-black cursor-pointer z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveDropdown(
                    activeDropdown === data.brand_id ? null : data.brand_id
                  );
                }}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </div>

              {activeDropdown === data.brand_id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-10 right-2 bg-white border border-gray-300 shadow-md rounded-md w-32 z-20"
                >
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      console.log("Edit", data.brand_name);
                    }}
                    className="flex items-center w-full gap-2 text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    <span className="material-symbols-outlined">
                      draft_orders
                    </span>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      console.log("Delete", data.brand_name);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Tombol Add Brand */}
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
            <p className="font-bold text-black">Add Brand</p>
          </button>
        </div>
      </Main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddBrandForm />
      </Modal>
    </div>
  );
}
