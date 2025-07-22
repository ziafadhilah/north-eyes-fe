"use client";

import { EditCameraData } from "@/constants/cameraData";
import { editCamera } from "@/service/camera/cameraService";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useState } from "react";

type EditCameraFormProps = {
  cameraData: EditCameraData;
  onClose: () => void;
};

export function EditCameraForm({ cameraData, onClose }: EditCameraFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...cameraData });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toastr.error("Token tidak ditemukan.");
      return;
    }

    try {
      const payload = {
        ...formData,
        area_id: cameraData.area_id,
      };
      const res = await editCamera(payload, token, cameraData.camera_id);
      if (res.data.status === "success") {
        toastr.success("Camera data has been updated.");
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        toastr.error("Failed to update camera. Please try again.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to update camera.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to update camera.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Edit Camera</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Camera Name
              </label>
              <input
                type="text"
                name="camera_name"
                value={formData.camera_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Camera Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Camera Code
              </label>
              <input
                type="text"
                name="camera_code"
                value={formData.camera_code}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Code"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                RTSP
              </label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter RTSP"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Input Description"
              />
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-2xl hover:bg-blue-700 cursor-pointer"
              disabled={isLoading}
              style={{
                background:
                  "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
              }}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
