/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { createBrands } from "@/service/brand/brandService";
import { uploadLogoBrand } from "@/service/brand/uploadBrandService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import RegionSelect, { OptionType } from "../General/Region/Region";

type AddBrandFormProps = {
  onClose: () => void;
};

export default function AddBrandForm({ onClose }: AddBrandFormProps) {
  const autoFocusRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    brand_name: "",
    logo_url: "",
    description: "",
    website_url: "",
    email: "",
    phone: "",
    industry: "",
    founded_year: "",
    headquarter_city: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    owner_name: "",
    employee_daily_point: "",
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Pastikan selalu diawali dengan +62
    if (!value.startsWith("+62")) {
      value = "+62" + value.replace(/\D/g, ""); // hapus semua non-digit
    } else {
      // Hapus karakter non-digit setelah +62
      value = "+62" + value.substring(3).replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
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
      toastr.error(`Logo size cannot be more than ${maxSizeInMB}MB.`);
      return;
    }

    setPreviewLogo(URL.createObjectURL(file));
    setLogoFile(file);

    try {
      const result = await uploadLogoBrand(file);
      const uploadedUrl = result.logo_url || result.path;
      setFormData((prev) => ({
        ...prev,
        logo_url: uploadedUrl,
      }));

      toastr.success("Logo uploaded successfully.");
    } catch (error) {
      console.error(error);
      toastr.error("Failed to upload logo.");
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
        country: "Indonesia",
        founded_year: parseInt(formData.founded_year),
        employee_daily_point: parseInt(formData.employee_daily_point),
        company_id: parseInt(company_id),
      };

      await createBrands(payload, token);
      toastr.success("Brand has been created.");
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to add brands.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to add brands.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const phoneDigits = formData.phone.replace("+62", "").trim();
    const isNumeric = /^\d+$/.test(phoneDigits);
    const isRepeated = /^(\d)\1+$/.test(phoneDigits);

    if (!formData.brand_name.trim()) {
      newErrors.brand_name = "Brand Name is required";
    } else if (/\d/.test(formData.brand_name)) {
      newErrors.brand_name = "Brand Name cannot contain numbers";
    } else if (formData.brand_name.length > 255) {
      newErrors.brand_name = "Brand Name max 255 characters";
    }

    if (!formData.employee_daily_point.trim()) {
      newErrors.employee_daily_point = "Employee Daily Point is required";
    } else if (formData.employee_daily_point.length > 255) {
      newErrors.employee_daily_point =
        "Employee Daily Point max 255 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot be more than 1000 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email is not valid";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length > 255) {
      newErrors.address = "Address cannot be more than 255 characters";
    }

    if (formData.website_url.trim()) {
      try {
        new URL(formData.website_url);
      } catch {
        newErrors.website_url = "Website URL is not valid";
      }
    }

    if (formData.founded_year) {
      const year = new Date(formData.founded_year).getFullYear();
      const currentYear = new Date().getFullYear();

      if (year < 1900) {
        newErrors.founded_year = "Founded year cannot be before 1900";
      } else if (year > currentYear) {
        newErrors.founded_year = "Founded year cannot be in the future";
      }
    }

    if (formData.headquarter_city.length > 255) {
      newErrors.headquarter_city =
        "Headquarter City cannot be more than 255 characters";
    } else if (!/^[A-Za-z\s'-]+$/.test(formData.headquarter_city)) {
      newErrors.headquarter_city =
        "Headquarter City must only contain letters, spaces, apostrophes, or hyphens";
    }

    if (formData.industry.length > 255) {
      newErrors.industry = "Industry cannot be more than 255 characters";
    } else if (!/^[A-Za-z\s'-]+$/.test(formData.industry)) {
      newErrors.industry =
        "Industry must only contain letters, spaces, apostrophes, or hyphens";
    }

    if (formData.owner_name.length > 255) {
      newErrors.owner_name = "Owner cannot be more than 255 characters";
    } else if (!/^[A-Za-z\s]+$/.test(formData.owner_name)) {
      newErrors.owner_name = "Owner only contain letters, spaces.";
    }

    if (!formData.phone.startsWith("+62")) {
      newErrors.phone = "Phone number must start with +62";
    } else if (!isNumeric) {
      newErrors.phone = "Phone number must only contain digits after +62";
    } else if (phoneDigits.length < 9 || phoneDigits.length > 12) {
      newErrors.phone = "Phone number must be between 9–12 digits after +62";
    } else if (isRepeated) {
      newErrors.phone = "Phone number cannot be all the same digits";
    }

    if (!/^\d+$/.test(formData.postal_code)) {
      newErrors.postal_code = "Postal code must only contain digits";
    } else if (
      formData.postal_code.length < 4 ||
      formData.postal_code.length > 10
    ) {
      newErrors.postal_code = "Postal code must be between 4–10 digits";
    }

    if (!logoFile) {
      newErrors.logo_url = "Logo is required";
    } else {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(logoFile.type)) {
        newErrors.logo_url = "Logo must be .jpg, .jpeg, or .png";
      }
      const maxSizeInMB = 2;
      if (logoFile.size > maxSizeInMB * 1024 * 1024) {
        newErrors.logo_url = `Logo must be less than ${maxSizeInMB}MB`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);

  return (
    <div className="relative z-10 overflow-y-auto max-h-[90vh] p-4">
      <h2 className="text-xl font-bold text-black mb-4">Add New Brand</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={autoFocusRef}
              type="text"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                errors.brand_name
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="Input Brand Name"
            />
            {errors.brand_name && (
              <p className="text-sm text-red-600 mt-1">{errors.brand_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Employee Daily Point <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="employee_daily_point"
              value={formData.employee_daily_point}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                errors.employee_daily_point
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="Input Employee Daily Point"
            />
            {errors.employee_daily_point && (
              <p className="text-sm text-red-600 mt-1">
                {errors.employee_daily_point}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Logo <span className="text-red-500">*</span>
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
                  <p className="text-sm mt-1">Upload Logo</p>
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

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              // maxLength={1000}
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
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Website URL
            </label>
            <input
              type="text"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                errors.website_url
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="EG: https://example.com"
            />
            {errors.website_url && (
              <p className="text-sm text-red-600 mt-1">{errors.website_url}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="EG : example@gmail.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Phone <span className="text-gray-500">(EG : +621234567890)</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="Input Phone EG : +621234567890"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Industry"
            />
            {errors.industry && (
              <p className="text-sm text-red-600 mt-1">{errors.industry}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Founded Year
            </label>
            <input
              type="date"
              min="1900-01-01"
              name="founded_year"
              value={formData.founded_year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors.founded_year && (
              <p className="text-sm text-red-600 mt-1">{errors.founded_year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Headquarter City
            </label>
            <input
              type="text"
              name="headquarter_city"
              value={formData.headquarter_city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Headquarter City"
            />
            {errors.headquarter_city && (
              <p className="text-sm text-red-600 mt-1">
                {errors.headquarter_city}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value="Indonesia"
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring border-gray-300 focus:border-blue-300"
              placeholder="Input Country"
              disabled
            />
          </div>

          <RegionSelect
            onProvinceChange={(province: OptionType) => {
              setFormData((prev) => ({
                ...prev,
                province: province.label,
              }));
            }}
            onRegencyChange={(regency: OptionType) => {
              setFormData((prev) => ({
                ...prev,
                city: regency.label,
                regency_id: regency.value.toString(),
              }));
            }}
          />

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                errors.address
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="Input Address"
            />
            {errors.address && (
              <p className="text-sm text-red-600 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Postal Code
            </label>
            <input
              type="number"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Postal Code"
            />
            {errors.postal_code && (
              <p className="text-sm text-red-600 mt-1">{errors.postal_code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Owner Name
            </label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Owner Name"
            />
            {errors.owner_name && (
              <p className="text-sm text-red-600 mt-1">{errors.owner_name}</p>
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
            {isLoading ? "Adding..." : "Add Brand"}
          </button>
        </div>
      </form>
    </div>
  );
}
