"use client";

import { EditSlugData } from "@/constants/slugData";
import { updateSlug } from "@/service/slug/slugService";
import { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

type EditSlugFormProps = {
  slugData: EditSlugData;
  onClose: () => void;
};

export default function EditSlugForm({ slugData, onClose }: EditSlugFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ ...slugData });

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
      toastr.info("Token not found.");
      return;
    }

    try {
      const payload = {
        ...formData,
      };

      console.log(payload);

      const res = await updateSlug(payload, token, slugData.slug_id.toString());
      if (res.data.status === "success") {
        toastr.success("Slug data has been updated.");
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        toastr.error("Failed to update slug. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to update slug.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to update slug.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-black mb-4">Edit Slug</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug Name
            </label>
            <input
              type="text"
              name="slug_name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={formData.slug_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug URL
            </label>
            <input
              type="text"
              name="slug"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={formData.slug}
              onChange={handleChange}
              required
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
            {isLoading ? "Menyimpan..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
