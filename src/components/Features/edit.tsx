"use client";

import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { updateFeatures } from "@/service/features/featuresService";
import { editFeatureData } from "@/constants/featuresData";

type EditFeatureFormProps = {
  featureData: editFeatureData;
  onClose: () => void;
};

export default function EditFeatureForm({
  onClose,
  featureData,
}: EditFeatureFormProps) {
  const autoFocusRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({ ...featureData });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "is_active") {
      setFormData((prev) => ({ ...prev, is_active: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Feature name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (typeof formData.is_active !== "boolean")
      newErrors.is_active = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toastr.error("Token not found.");
      return;
    }

    try {
      const payload = { ...formData };
      const res = await updateFeatures(payload, token, featureData.feature_id);

      if (res.data.status === "success") {
        toastr.success("Feature data has been updated.");
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        toastr.error("Failed to update feature. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to update feature.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to update feature.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Edit Features</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Feature Name
              </label>
              <input
                ref={autoFocusRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter feature name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="is_active"
                value={formData.is_active === true ? "true" : "false"}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="" disabled>
                  -- Select Status --
                </option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              {errors.is_active && (
                <p className="text-sm text-red-600 mt-1">{errors.is_active}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
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
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Input Description"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
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
              {isLoading ? "Please wait..." : "Edit Feature"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
