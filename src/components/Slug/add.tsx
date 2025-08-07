"use client";

import { createSlug } from "@/service/slug/slugService";
import { useEffect, useRef, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

type AddSlugFormProps = {
  onClose: () => void;
};

export default function AddSlugForm({ onClose }: AddSlugFormProps) {
  const slugNameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    slug: "",
    slug_name: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "slug") {
      let newValue = value.replace(/\s+/g, "-");
      newValue = newValue.replace(/[^a-zA-Z0-9\-./:]/g, "");
      newValue = newValue.toLowerCase();

      setFormData((prev) => ({ ...prev, slug: newValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const slugNameRegex = /^[a-zA-Z0-9-_ ]+$/;

    if (!formData.slug_name) {
      newErrors.slug_name = "Slug name is required";
    } else if (!slugNameRegex.test(formData.slug_name)) {
      newErrors.slug_name = "Slug name cannot contain special characters";
    }

    if (!formData.slug) {
      newErrors.slug = "Slug URL is required";
    } else {
      try {
        new URL(formData.slug);
      } catch (err) {
        newErrors.slug = "Slug must be a valid URL (e.g. https://example.com)";
        console.error(err);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
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

      const res = await createSlug(payload, token);
      if (res.data.status === "success") {
        toastr.success("Slug data has been updated.");
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        toastr.error("Failed to add slug. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to add slug.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to add slug.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slugNameRef.current) {
      slugNameRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add Slug</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug Name
              </label>
              <input
                ref={slugNameRef}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Slug Name"
                name="slug_name"
                value={formData.slug_name}
                onChange={handleChange}
              />
              {errors.slug_name && (
                <p className="text-sm text-red-600 mt-1">{errors.slug_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug URL
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="e.g : https://www.example.com"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
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
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
