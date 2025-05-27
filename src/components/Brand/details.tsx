/* eslint-disable @next/next/no-img-element */
"use client";
import Sidebar from "../General/Layout/Sidebar";
import { useParams } from "next/navigation";
import Link from "next/link";
import Main from "../General/Layout/Main";
import Modal from "../General/Modal/Modal";
import { useState, useEffect, useRef } from "react";
import AddOutletForm from "./add_outlet";
import { fetchBrandsById } from "@/service/brand/brandService";
import { BrandData } from "@/constants/brandData";

export default function BrandDetails() {
  const params = useParams();
  const id = params?.id as string;
  const [brand, setBrand] = useState<BrandData[]>([]);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (token && companyId && id) {
      fetchBrandsById(token, id)
        .then((res) => {
          console.log(res.data?.data);
          // setBrand(res.data?.data);
        })
        .catch((err) => console.error("Error fetching brand:", err));
    }
  }, [id]);

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
      </Main>

      {/* Modal Add Outlet */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddOutletForm />
      </Modal>
    </div>
  );
}
