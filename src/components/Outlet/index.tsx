/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import {
  deleteOutlet,
  fetchOutletByBrandId,
} from "@/service/outlet/outletService";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import AddOutletForm from "./add_outlet";
import Link from "next/link";
import { OutletData } from "@/constants/outletData";
import OutletDetailPage from "./detail";
import EditOutletForm from "./edit";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Pagination from "@/components/General/Pagination/Pagination";

export default function OutletPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const brand_name = searchParams.get("name") as string;
  const [outlets, setOutlets] = useState<OutletData[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [outletToEdit, setOutletToEdit] = useState<OutletData | null>(null);

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [outletToDelete, setOutletToDelete] = useState<OutletData | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<OutletData | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const loadOutlet = async (page: number) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");
    if (token && companyId && id) {
      fetchOutletByBrandId(token, id, page)
        .then((res) => {
          if (res.data.status === "success") {
            const responseData = res.data?.data;
            setTimeout(() => {
              setOutlets(responseData?.data || []);
              setTotalPages(responseData?.pages || 1);
              setIsLoading(false);
            }, 2000);
          } else {
            toastr.error("Error fetching brands");
            setIsLoading(false);
          }
          // setOutlets(res.data?.data?.data || []);
        })
        .catch((err) => {
          console.error("Error fetching brand:", err);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (id) {
      loadOutlet(currentPage);
    }
  }, [id, currentPage]);

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

  const handleDelete = async (outletId: string) => {
    const token = localStorage.getItem("token") || "";

    try {
      const res = await deleteOutlet(token, outletId);
      if (res.data.status === "success") {
        toastr.success("Outlet deleted successfully");
        setTimeout(() => window.location.reload(), 1000);
        loadOutlet(currentPage);
      } else {
        toastr.error("Failed to delete outlet");
      }
    } catch (error) {
      toastr.error("Error occurred while deleting outlet");
      console.error(error);
    }
  };

  const openEditModal = (outlet: OutletData) => {
    setOutletToEdit(outlet);
    setActiveDropdown(null);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setOutletToEdit(null);
  };

  const handleOpenDetail = (outlet: OutletData) => {
    setSelectedOutlet(outlet);
    setActiveDropdown(null);
    openDetailModal();
  };

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-black transition-transform duration-300 ease-in-out hover:scale-120"
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
                  <li className="text-gray-700 font-medium">{brand_name}</li>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          <button
            onClick={openAddModal}
            className="w-full max-w-sm min-h-[250px] bg-radial-blue rounded-xl shadow flex flex-col items-center justify-center p-6 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-200"
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-6">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 mt-3">
                Loading ... Please wait
              </p>
            </div>
          ) : (
            outlets.map((data) => (
              <div key={data.outlet_id} className="relative w-full max-w-sm">
                <Link
                  href={{
                    pathname: `/brand/area/${data.outlet_id}`,
                    query: {
                      outlet_name: data.outlet_name,
                      brand_name: brand_name,
                    },
                  }}
                  className="p-4 min-h-[250px] cursor-pointer rounded-lg shadow-sm flex flex-col items-center justify-center text-center bg-radial-blue transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-200"
                >
                  <img
                    src={
                      data.logo_url
                        ? data.logo_url
                        : "/static/images/ex_brand.png"
                    }
                    alt={data.outlet_name}
                    className="w-50 h-50 mb-3"
                  />
                  <p className="font-bold text-black">{data.outlet_name}</p>
                </Link>
                <div
                  className="absolute top-5 right-1 text-gray-600 hover:text-black cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveDropdown(
                      activeDropdown === data.outlet_id ? null : data.outlet_id
                    );
                  }}
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </div>

                {activeDropdown === data.outlet_id && (
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
                        setOutletToDelete(data);
                        setIsConfirmDeleteOpen(true);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      <span className="material-symbols-outlined">delete</span>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Main>

      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <AddOutletForm onClose={closeAddModal} brandId={id} />
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
        {selectedOutlet ? (
          <OutletDetailPage
            outletId={selectedOutlet.outlet_id}
            onClose={closeDetailModal}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {outletToEdit ? (
          <EditOutletForm
            outletData={outletToEdit}
            onClose={closeEditModal}
            brandId={id}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        size="sm"
      >
        {/* <div className="p-2"> */}
        <h2 className="text-lg font-bold mb-4">Confirm to Delete</h2>
        <p className="mb-4">Are you sure you want to delete this outlet?</p>
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
              if (outletToDelete) {
                handleDelete(outletToDelete.outlet_id);
                setIsConfirmDeleteOpen(false);
              }
            }}
          >
            Delete
          </button>
        </div>
        {/* </div> */}
      </Modal>
    </div>
  );
}
