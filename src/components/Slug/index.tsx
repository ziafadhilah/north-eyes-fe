/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import Pagination from "@/components/General/Pagination/Pagination";
import { useEffect, useState } from "react";
import AddSlugForm from "./add";
import { useRouter } from "next/navigation";
import { SlugData } from "@/constants/slugData";
import { deleteSlug, fetchSlug } from "@/service/slug/slugService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import SlugDetailPage from "./detail";
import EditSlugForm from "./edit";

export default function SlugPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const [selectedSlug, setSelectedSlug] = useState<SlugData | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [slugToEdit, setSlugToEdit] = useState<SlugData | null>(null);

  const [slugToDelete, setSlugToDelete] = useState<SlugData | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [slug, setSlug] = useState<SlugData[]>([]);
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

  const loadSlug = async (page: number) => {
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";
    fetchSlug(token, page)
      .then((response) => {
        if (response.data.status === "success") {
          const responseData = response.data?.data;
          setTimeout(() => {
            setSlug(responseData?.slugs_data || []);
            setTotalPages(responseData?.pages || 1);
            setIsLoading(false);
          }, 2000);
        } else {
          toastr.error("Error fetching slugs");
          setIsLoading(false);
        }
      })
      .catch((error) => {
        toastr.error("Error while fetching slugs data:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadSlug(currentPage);
  }, [currentPage]);

  const handleOpenDetail = (slug: SlugData) => {
    setSelectedSlug(slug);
    openDetailModal();
  };

  const openEditModal = (slug: SlugData) => {
    setSlugToEdit(slug);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSlugToEdit(null);
  };

  const handleDelete = async (slugId: string) => {
    const token = localStorage.getItem("token") || "";

    try {
      const res = await deleteSlug(token, slugId);
      if (res.data.status === "success") {
        toastr.success("Slug deleted successfully");
        setTimeout(() => window.location.reload(), 500);
        loadSlug(currentPage);
      } else {
        toastr.error("Failed to delete brand");
      }
    } catch (error) {
      toastr.error("Error occurred while deleting brand");
      console.error(error);
    }
  };

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-5 w-full p-2">
          <div className="flex items-center">
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Manage Slugs
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

        <div className="ml-10 flex items-center justify-between mb-5">
          <div className="flex gap-4">&nbsp;</div>
          <button
            onClick={openAddModal}
            className="text-white p-2 bg-blue-600 rounded-xl shadow-sm flex items-center justify-center hover:scale-105 hover:bg-blue-500"
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined">add</span>
              <span className="text-md font-medium text-white">
                Add Slug&nbsp;
              </span>
            </div>
          </button>
        </div>

        <div className="w-full overflow-x-auto border rounded-lg shadow-sm bg-white p-2">
          <table className="w-full text-sm text-left text-gray-700 min-w-[700px]">
            <thead className="text-gray-700 text-center">
              <tr>
                <th className="py-3 px-4">Slug Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading... Please wait</span>
                    </div>
                  </td>
                </tr>
              ) : slug.length > 0 ? (
                slug.map((data) => (
                  <tr key={data.slug_id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{data.slug_name}</td>
                    <td className="py-3 px-4">{data.slug}</td>
                    <td className="py-3 px-4">
                      <button
                        title="Detail"
                        onClick={() => handleOpenDetail(data)}
                        className="text-blue-600 px-3 py-1 transition transition-transform duration-300 ease-in-out hover:scale-130"
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        title="Edit"
                        onClick={() => openEditModal(data)}
                        className="text-yellow-500 px-3 py-1 transition transition-transform duration-300 ease-in-out hover:scale-130"
                      >
                        <span className="material-symbols-outlined">
                          draft_orders
                        </span>
                      </button>
                      <button
                        title="Delete"
                        onClick={() => {
                          setSlugToDelete(data);
                          setIsConfirmDeleteOpen(true);
                        }}
                        className="text-red-500 px-3 py-1 transition transition-transform duration-300 ease-in-out hover:scale-130"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No slugs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Main>
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <AddSlugForm onClose={closeAddModal} />
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
        {selectedSlug ? (
          <SlugDetailPage
            slugId={selectedSlug.slug_id}
            onClose={closeDetailModal}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {slugToEdit ? (
          <EditSlugForm slugData={slugToEdit} onClose={closeEditModal} />
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
                if (slugToDelete) {
                  handleDelete(slugToDelete.slug_id.toString());
                  setIsConfirmDeleteOpen(false);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
