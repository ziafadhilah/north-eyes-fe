"use client";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { createCamera } from "@/service/camera/cameraService";

type AddCameraFormProps = {
  onClose: () => void;
  areaId: string;
};

export default function AddCameraForm({ onClose, areaId }: AddCameraFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    camera_name: "",
    camera_code: "",
    rstv: "",
    description: "",
    area_id: areaId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const company_id = localStorage.getItem("company_id");

    if (!token || !company_id) {
      alert("Token atau Company ID tidak ditemukan.");
      return;
    }

    try {
      const payload = {
        ...formData,
      };

      const res = await createCamera(payload, token);
      console.log(res);
      toastr.success("Success");
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error("Failed", error.response?.data?.message || error.message);
      } else {
        toastr.error("Failed to add data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, area_id: areaId }));
  }, [areaId]);

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add Camera</h2>
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
                name="rstv"
                value={formData.rstv}
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
              className="text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
              disabled={isLoading}
              style={{
                background:
                  "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
              }}
            >
              {isLoading ? "Menyimpan..." : "Add Camera"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
