/* eslint-disable @next/next/no-img-element */
"use client";

import { SlugData } from "@/constants/slugData";
import { userManagementEditData } from "@/constants/userManagementData";
import { fetchSlug } from "@/service/slug/slugService";
import { uploadPictureUser } from "@/service/user-management/uploadUserPictService";
import { updateUsersManagement } from "@/service/user-management/userManagement";
import axios from "axios";
import { useEffect, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

type EditUserManagementFormProps = {
  userData: userManagementEditData;
  onClose: () => void;
};

export default function EditUserManagementForm({
  userData,
  onClose,
}: EditUserManagementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...userData,
    role: userData.role?.toLowerCase() || "",
  });
  const [slug, setSlug] = useState<SlugData[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [previewLogo, setPreviewLogo] = useState<string | null>(
    userData.profile_picture_url || null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadSlug = async () => {
    const token = localStorage.getItem("token") || "";
    fetchSlug(token)
      .then((response) => {
        if (response.data.status === "success") {
          const responseData = response.data?.data;
          setSlug(responseData?.slugs_data || []);
        } else {
          toastr.error("Error fetching slugs");
        }
      })
      .catch((error) => {
        toastr.error("Error while fetching slugs data:", error);
      });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
    } else if (!nameRegex.test(formData.full_name)) {
      newErrors.full_name =
        "Full name cannot contain special characters or numbers";
    } else if (formData.full_name.length > 255) {
      newErrors.full_name = "Full name cannot exceed 255 characters";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^(\+62|62|08)[0-9]{8,13}$/.test(formData.phone_number)) {
      newErrors.phone_number =
        "Phone number must start with +62, 62, or 08 and contain 10–15 digits total";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (formData.username.length > 20) {
      newErrors.username = "Username cannot exceed 20 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.slug_id) {
      newErrors.slug_id = "Slug is required";
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
      toastr.error("Token not found.");
      return;
    }

    try {
      const payload = { ...formData };
      const res = await updateUsersManagement(payload, token, userData.user_id);

      if (res.data.status === "success") {
        toastr.success("User data has been updated.");
        onClose();
        setTimeout(() => window.location.reload(), 500);
      } else {
        toastr.error("Failed to update users. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to update users.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to update users.");
      }
    } finally {
      setIsLoading(false);
    }
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
      const result = await uploadPictureUser(file);
      const uploadedUrl = result.profile_picture_url || result.path;
      setFormData((prev) => ({
        ...prev,
        profile_picture_url: uploadedUrl,
      }));

      toastr.success("Logo berhasil diupload.");
    } catch (error) {
      console.error(error);
      toastr.error("Gagal upload logo.");
    }
  };

  useEffect(() => {
    loadSlug();
  }, []);

  return (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-black mb-4">Edit User</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              name="full_name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter Full Name"
            />
            {errors.full_name && (
              <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={handleChange}
              name="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter Username"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={formData.email}
              onChange={handleChange}
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter Email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              name="phone_number"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter Phone"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Picture
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="logo-upload"
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Choose Image
              </label>
              {logoFile && (
                <span className="text-sm text-gray-600">
                  {logoFile.name} ({(logoFile.size / 1024).toFixed(2)} KB)
                </span>
              )}
            </div>
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
                alt="Preview Profile"
                className="mt-2 h-24 object-contain border rounded"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="" disabled>
                -- Select Role --
              </option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            {/* {errors.role && (
              <p className="text-sm text-red-600 mt-1">{errors.role}</p>
            )} */}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <select
              name="slug_id"
              value={formData.slug_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="" disabled>
                -- Select Slug --
              </option>
              {slug.map((item) => (
                <option key={item.slug_id} value={item.slug_id}>
                  {item.slug_name}
                </option>
              ))}
            </select>
            {/* {errors.slug_id && (
              <p className="text-sm text-red-600 mt-1">{errors.slug_id}</p>
            )} */}
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
