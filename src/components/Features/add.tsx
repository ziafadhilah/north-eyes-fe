"use client";

import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { createFeatures } from "@/service/features/featuresService";

type AddFeaturesFormProps = {
  onClose: () => void;
};

export default function AddFeaturesForm({ onClose }: AddFeaturesFormProps) {
  const autoFocusRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Feature name is required";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.name)) {
      newErrors.name = "Feature name cannot contain special characters";
    } else if (formData.name.length > 255) {
      newErrors.name = "Feature name cannot be longer than 255 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      newErrors.description =
        "Description cannot be longer than 1000 characters";
    }

    if (!formData.is_active.trim()) newErrors.is_active = "Status is required";

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

    const payload = {
      ...formData,
      is_active: formData.is_active === "true" ? true : false,
      order: 1,
    };

    try {
      await createFeatures(payload, token);
      toastr.success("Feature added successfully.");
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to add feature : ",
          error.response?.data?.message || error.message
        );
        console.log(error);
      } else {
        toastr.error("Failed to add feature.");
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
        <h2 className="text-xl font-bold text-black mb-4">Add Features</h2>
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
                value={formData.is_active}
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
              {isLoading ? "Adding..." : "Add Feature"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
