/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import Pagination from "@/components/General/Pagination/Pagination";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AddBrandForm from "./add";
import { BrandData } from "@/constants/brandData";
import { deleteBrands, fetchBrands } from "@/service/brand/brandService";
import BrandDetailPage from "./detail";
import EditBrandForm from "./edit";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function BrandPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<BrandData | null>(null);

  const [brandToDelete, setBrandToDelete] = useState<BrandData | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const openEditModal = (brand: BrandData) => {
    setBrandToEdit(brand);
    setActiveDropdown(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setBrandToEdit(null);
  };

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const loadBrands = async (page: number) => {
    setIsLoading(true);
    const companyIdData = localStorage.getItem("company_id");
    const token = localStorage.getItem("token");

    fetchBrands(companyIdData || "", token || "", page)
      .then((response) => {
        if (response.data.status === "success") {
          const responseData = response.data?.data;
          setTimeout(() => {
            setBrands(responseData?.data || []);
            setTotalPages(responseData?.pages || 1);
            setIsLoading(false);
          }, 2000);
        } else {
          toastr.error("Error fetching brands");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        toastr.error("Error while fetching brands data:", error);
        setIsLoading(false);
      });
  };

  const handleDelete = async (brandId: string) => {
    const token = localStorage.getItem("token") || "";

    try {
      const res = await deleteBrands(token, brandId);
      if (res.data.status === "success") {
        toastr.success("Brand deleted successfully");
        setTimeout(() => window.location.reload(), 500);
        loadBrands(currentPage);
      } else {
        toastr.error("Failed to delete brand");
      }
    } catch (error) {
      toastr.error("Error occurred while deleting brand");
      console.error(error);
    }
  };

  useEffect(() => {
    const companyData = localStorage.getItem("company");
    const token = localStorage.getItem("token");
    if (!companyData || !token) {
      router.push("/login");
      return;
    }
    setCompanyName(companyData || "Group Name");
    loadBrands(currentPage);
  }, [currentPage]);

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
    if (isAddModalOpen || isDetailModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isAddModalOpen, isDetailModalOpen]);

  const handleOpenDetail = (brand: BrandData) => {
    setSelectedBrand(brand);
    setActiveDropdown(null);
    openDetailModal();
  };

  return (
    <>
      <Main>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 w-full gap-4">
          <div className="flex items-start md:items-center gap-3">
            <div></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-title-color mb-1 uppercase">
                {companyName || "Group Name"}
              </h1>
            </div>
          </div>

          <div className="text-left md:text-right p-3">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              {dayName}
            </span>
            <p className="text-md font-medium text-black mt-2 md:mt-4">
              {dateTimeString}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {isLoading ? (
            <div className="flex items-center justify-center w-full h-[60vh] col-span-full">
              <div className="flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600 mt-3">
                  Loading ... Please wait
                </p>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={openAddModal}
                className="w-full min-h-[250px] max-w-sm p-4 bg-radial-blue rounded-lg shadow-sm flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-200"
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

              {brands.map((data) => (
                <div key={data.brand_id} className="relative w-full max-w-sm">
                  <Link
                    href={{
                      pathname: `brand/outlet/${data.brand_id}`,
                      query: { name: data.brand_name },
                    }}
                    className="p-4 min-h-[250px] cursor-pointer rounded-lg shadow-sm flex flex-col items-center justify-center text-center bg-radial-blue transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-200"
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
                    <p className="text-black">{data.address}</p>
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
                        onClick={() => handleOpenDetail(data)}
                        className="flex items-center w-full gap-2 text-left px-4 py-2 hover:bg-gray-100 text-blue-500"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                        Detail
                      </button>
                      <button
                        onClick={() => openEditModal(data)}
                        className="flex items-center w-full gap-2 text-left px-4 py-2 hover:bg-gray-100 text-yellow-500"
                      >
                        <span className="material-symbols-outlined">
                          draft_orders
                        </span>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          setBrandToDelete(data);
                          setIsConfirmDeleteOpen(true);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Main>

      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <AddBrandForm onClose={closeAddModal} />
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
        {selectedBrand ? (
          <BrandDetailPage
            brandId={selectedBrand.brand_id}
            onClose={closeDetailModal}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {brandToEdit ? (
          <EditBrandForm brandData={brandToEdit} onClose={closeEditModal} />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
      >
        <div className="p-2">
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this brand?</p>
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
                if (brandToDelete) {
                  handleDelete(brandToDelete.brand_id);
                  setIsConfirmDeleteOpen(false);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
