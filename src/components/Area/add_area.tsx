/* eslint-disable @next/next/no-img-element */
"use client";
import { createArea } from "@/service/area/areaService";
import { uploadLogoArea } from "@/service/area/uploadAreaService";
import { useState, useEffect, useRef } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

type AddAreaFormProps = {
  onClose: () => void;
  outletId: string;
};

export default function AddAreaForm({ onClose, outletId }: AddAreaFormProps) {
  const autoFocusRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    area_name: "",
    logo_url: "",
    description: "",
    outlet_id: outletId,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toastr.error("Logo format must be .jpg, .jpeg, atau .png");
      return;
    }

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toastr.error(`Image size cannot be more than ${maxSizeInMB}MB.`);
      return;
    }

    setPreviewLogo(URL.createObjectURL(file));
    setLogoFile(file);

    try {
      const result = await uploadLogoArea(file);
      const uploadedUrl = result.logo_url || result.path;
      setFormData((prev) => ({
        ...prev,
        logo_url: uploadedUrl,
      }));

      toastr.success("Image uploaded successfully.");
    } catch (error) {
      console.error(error);
      toastr.error("Failed to upload Image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const company_id = localStorage.getItem("company_id");

    if (!token || !company_id) {
      toastr.error("Token or Company ID not found.");
      return;
    }

    try {
      const payload = {
        ...formData,
      };

      await createArea(payload, token);
      console.log(payload);
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.area_name.trim()) {
      newErrors.area_name = "Area Name is required";
    } else if (formData.area_name.length > 255) {
      newErrors.area_name = "Area Name max 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot be more than 1000 characters";
    }

    if (!logoFile) {
      newErrors.logo_url = "Image is required";
    } else {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(logoFile.type)) {
        newErrors.logo_url = "Image must be .jpg, .jpeg, or .png";
      }
      const maxSizeInMB = 2;
      if (logoFile.size > maxSizeInMB * 1024 * 1024) {
        newErrors.logo_url = `Image must be less than ${maxSizeInMB}MB`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, outlet_id: outletId }));
  }, [outletId]);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add Area</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Area Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="area_name"
                value={formData.area_name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.area_name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="e.g : example@email.com"
              />
              {errors.area_name && (
                <p className="text-sm text-red-600 mt-1">{errors.area_name}</p>
              )}
            </div>
            <div className="mt-2">
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image Cover <span className="text-red-500">*</span>
              </label>

              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />

              <label
                htmlFor="logo-upload"
                className="mt-1 flex items-center justify-center h-30 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition"
              >
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="Preview Logo"
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="material-symbols-outlined text-5xl text-gray-400">
                      add_photo_alternate
                    </span>
                    <p className="text-sm mt-1">Upload Cover</p>
                  </div>
                )}
              </label>

              {logoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  File: {logoFile.name} ({(logoFile.size / 1024).toFixed(2)} KB)
                </p>
              )}

              {errors.logo_url && (
                <p className="text-sm text-red-600 mt-1">{errors.logo_url}</p>
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
              {isLoading ? "Saving" : "Add Area"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
