/* eslint-disable @next/next/no-img-element */
"use client";

import { EditAreaData } from "@/constants/areaData";
import { updateAreas } from "@/service/area/areaService";
import { uploadLogoArea } from "@/service/area/uploadAreaService";
import { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

type EditAreaFormProps = {
  areaData: EditAreaData;
  outletId: string;
  onClose: () => void;
};

export default function EditAreaForm({
  areaData,
  onClose,
  outletId,
}: EditAreaFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(
    areaData.logo_url || null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({ ...areaData });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toastr.error(`Ukuran logo tidak boleh lebih dari ${maxSizeInMB}MB.`);
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

      toastr.success("Logo berhasil diupload.");
    } catch (error) {
      console.error(error);
      toastr.error("Gagal upload logo.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan.");
      return;
    }

    try {
      const payload = {
        ...formData,
        outlet_id: outletId,
      };

      const res = await updateAreas(payload, token, areaData.area_id);
      if (res.data.status === "success") {
        toastr.success("Brand data has been updated.");
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        toastr.error("Failed to update brands. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to update brand.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to update brand.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add Area</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                { label: "Area Name", name: "area_name" },
                { label: "Description", name: "description" },
              ] as {
                label: string;
                name: keyof typeof formData;
                type?: string;
              }[]
            ).map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={`Input ${label}`}
                  required
                />
              </div>
            ))}
            <div>
              <label
                htmlFor="logo-upload"
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 inline-block"
              >
                Image Cover
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              {previewLogo && (
                <img
                  src={previewLogo}
                  alt="Preview Logo"
                  className="mt-2 h-24 object-contain border rounded"
                />
              )}
              {logoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  File: {logoFile.name} ({(logoFile.size / 1024).toFixed(2)} KB)
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
              {isLoading ? "Menyimpan..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
