/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import { useEffect, useState } from "react";
import AddFeaturesForm from "./add";
import {
  deleteFeatures,
  fetchFeatures,
  updateFeaturesStatus,
} from "@/service/features/featuresService";
import { editFeatureData, featureData } from "@/constants/featuresData";
import { useRouter } from "next/navigation";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import FeatureDetailPage from "./detail";
import EditFeatureForm from "./edit";
import { SkeletonBox } from "../General/Skleton/Skleton";

export default function FeaturesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<featureData | null>(
    null
  );
  const [isConfirmStatusOpen, setIsConfirmStatusOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [features, setFeatures] = useState<featureData[]>([]);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [featureToEdit, setFeatureToEdit] = useState<editFeatureData | null>(
    null
  );

  const [featureToDelete, setFeatureToDelete] = useState<featureData | null>(
    null
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const openEditModal = (feature: editFeatureData) => {
    setFeatureToEdit(feature);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFeatureToEdit(null);
  };

  const closeStatusModal = () => {
    setIsConfirmStatusOpen(false);
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

  const loadFeatures = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";
    const res = await fetchFeatures(token);
    if (res.status === 200) {
      const response = res.data.data.feature;
      console.log(response);
      setTimeout(() => {
        setFeatures(response);
        setIsLoading(false);
      }, 1000);
    } else {
      toastr.error("Data not found");
      setIsLoading(false);
    }
  };

  const handleDelete = async (featureId: string) => {
    const token = localStorage.getItem("token") || "";

    try {
      const res = await deleteFeatures(token, featureId);
      if (res.data.status === "success") {
        toastr.success("Feature deleted successfully");
        setTimeout(() => window.location.reload(), 500);
        loadFeatures();
      } else {
        toastr.error("Failed to delete feature");
      }
    } catch (error) {
      toastr.error("Error occurred while deleting feature");
      console.error(error);
    }
  };

  const handleToggleStatus = async (featureData: featureData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toastr.error("Token not found");
      return;
    }

    const updatedStatus = !featureData.is_active;

    // Siapkan payload
    const payload = {
      is_active: updatedStatus,
    };

    try {
      const res = await updateFeaturesStatus(
        payload,
        token,
        featureData.feature_id
      );

      if (res.data.status === "success") {
        toastr.success("Status updated successfully");
        setFeatures((prev) =>
          prev.map((f) =>
            f.feature_id === featureData.feature_id
              ? { ...f, is_active: updatedStatus }
              : f
          )
        );
      } else {
        toastr.error("Failed to update status");
      }
    } catch (error) {
      toastr.error("Error updating status");
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadFeatures();
  }, []);

  useEffect(() => {
    if (isModalOpen || isDetailModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, isDetailModalOpen]);

  const handleOpenDetail = (feature: featureData) => {
    setSelectedFeature(feature);
    openDetailModal();
  };
  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-5 w-full p-2">
          <div className="flex items-center">
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Manage Features
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
            onClick={openModal}
            className="text-white p-2 bg-blue-600 rounded-xl shadow-sm flex items-center justify-center hover:scale-102 hover:bg-blue-500"
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined">add</span>
              <span className="text-md font-medium text-white">
                Add Feature&nbsp;
              </span>
            </div>
          </button>
        </div>

        <div className="w-full overflow-x-auto border rounded-lg shadow-sm bg-white p-2">
          <table className="w-full text-sm text-left text-gray-700 min-w-[700px]">
            <thead className="text-gray-700 text-center">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-center">
                    <SkeletonBox className="w-full h-[300px]" />
                  </td>
                </tr>
              ) : features.length > 0 ? (
                features.map((data) => (
                  <tr
                    key={data.feature_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{data.name}</td>
                    <td className="py-3 px-4">{data.description}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedFeature(data);
                          setIsConfirmStatusOpen(true);
                        }}
                        className={`px-3 py-1 rounded-full font-medium text-white ${
                          data.is_active
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {data.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="py-3 px-4 flex flex-row">
                      <button
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-blue-500"
                        title="View"
                        onClick={() => handleOpenDetail(data)}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-yellow-500"
                        title="Edit"
                        onClick={() => openEditModal(data)}
                      >
                        <span className="material-symbols-outlined">
                          draft_orders
                        </span>
                      </button>
                      <button
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-red-500"
                        title="Delete"
                        onClick={() => {
                          setFeatureToDelete(data);
                          setIsConfirmDeleteOpen(true);
                        }}
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
                    colSpan={6}
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No users data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddFeaturesForm onClose={closeModal} />
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
        {selectedFeature ? (
          <FeatureDetailPage
            featureId={selectedFeature.feature_id}
            onClose={closeDetailModal}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {featureToEdit ? (
          <EditFeatureForm
            featureData={featureToEdit}
            onClose={closeEditModal}
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
        <div className="p-2">
          <h2 className="text-lg font-bold mb-4">Confirm to Delete</h2>
          <p className="mb-4">Are you sure you want to delete this feature?</p>
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
                if (featureToDelete) {
                  handleDelete(featureToDelete.feature_id);
                  setIsConfirmDeleteOpen(false);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmStatusOpen && selectedFeature !== null}
        onClose={closeStatusModal}
        size="sm"
      >
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Status Change Confirmation</h2>
          <p className="mb-6">
            Are you sure want to{" "}
            {selectedFeature?.is_active ? "Deactivate" : "Activate"} this
            features?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsConfirmStatusOpen(false);
                setSelectedFeature(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (selectedFeature) {
                  await handleToggleStatus(selectedFeature);
                  setIsConfirmStatusOpen(false);
                  setSelectedFeature(null);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Yes, Confirm
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
