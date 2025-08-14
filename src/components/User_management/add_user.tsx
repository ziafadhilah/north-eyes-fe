/* eslint-disable @next/next/no-img-element */
"use client";

import { uploadPictureUser } from "@/service/user-management/uploadUserPictService";
import { useEffect, useRef, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { createUsersManagement } from "@/service/user-management/userManagement";
import { fetchSlug } from "@/service/slug/slugService";
import { SlugData } from "@/constants/slugData";

type AddUserFormProps = {
  onClose: () => void;
};

export default function AddUserForm({ onClose }: AddUserFormProps) {
  const autoFocusRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [slug, setSlug] = useState<SlugData[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password_repeat: "",
    profile_picture_url: "",
    slug_id: "",
    role: "",
  });

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toastr.error("Logo harus berformat .jpg, .jpeg, atau .png");
      return;
    }

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toastr.error(`Ukuran logo tidak boleh lebih dari ${maxSizeInMB}MB.`);
      return;
    }

    setPreviewLogo(URL.createObjectURL(file));
    setLogoFile(file);

    try {
      const result = await uploadPictureUser(file);
      const uploadedUrl = result.logo_url || result.path;
      setFormData((prev) => ({
        ...prev,
        profile_picture_url: uploadedUrl,
      }));

      toastr.success("Image uploaded.");
    } catch (error) {
      console.error(error);
      toastr.error("Failed to upload.");
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full Name is required";
    } else if (!nameRegex.test(formData.full_name)) {
      newErrors.full_name = "Full Name must only contain letters and spaces";
    }

    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email is not valid";
      }
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^(\+62|62|08)[0-9]{8,13}$/.test(formData.phone_number)) {
      newErrors.phone_number =
        "Phone number must start with +62, 62, or 08 and contain 10–15 digits total";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password min 6 characters";
    }

    if (!formData.password_repeat.trim())
      newErrors.password_repeat = "Password Repeat is required";

    if (!formData.role) newErrors.role = "Role is required";

    if (!formData.slug_id) newErrors.slug_id = "Slug is required";

    if (
      formData.password &&
      formData.password_repeat &&
      formData.password !== formData.password_repeat
    ) {
      newErrors.password_repeat = "Password does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
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
        company_id: parseInt(company_id),
      };

      await createUsersManagement(payload, token);
      toastr.success("User added successfully.");
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to add user : ",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to add user.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlug();
  }, []);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);
  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add User</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={autoFocusRef}
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.full_name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="Input Full Name"
              />
              {errors.full_name && (
                <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.username
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="Input Username"
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="Input Email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.phone_number
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="e.g : +6281234567890"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phone_number}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-300"
                  }`}
                  placeholder="Input Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500"
                >
                  {showPassword ? (
                    <span className="material-symbols-outlined">
                      visibility_off
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password Repeat <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  name="password_repeat"
                  value={formData.password_repeat}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                    errors.password_repeat
                      ? "border-red-500"
                      : "border-gray-300 focus:border-blue-300"
                  }`}
                  placeholder="Input Password"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500"
                >
                  {showRepeatPassword ? (
                    <span className="material-symbols-outlined">
                      visibility_off
                    </span>
                  ) : (
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  )}
                </button>
              </div>
              {errors.password_repeat && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password_repeat}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Picture
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
                    alt="Preview Picture"
                    className="object-contain max-h-full max-w-full"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <span className="material-symbols-outlined text-5xl text-gray-400">
                      add_photo_alternate
                    </span>
                    <p className="text-sm mt-1">Upload Picture</p>
                  </div>
                )}
              </label>
              {logoFile && (
                <p className="text-sm text-gray-600 mt-1">
                  File: {logoFile.name} ({(logoFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
              {errors.profile_picture_url && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.profile_picture_url}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.role
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
              >
                <option value="" disabled>
                  -- Select Role --
                </option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1">{errors.role}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <select
                name="slug_id"
                value={formData.slug_id}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.slug_id
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
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
              {errors.slug_id && (
                <p className="text-sm text-red-600 mt-1">{errors.slug_id}</p>
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
              {isLoading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
