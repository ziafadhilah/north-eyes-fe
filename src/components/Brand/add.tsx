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
      const result = await uploadLogoBrand(file);
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
    if (!validateForm()) return;
    setIsLoading(true);

    const token = localStorage.getItem("token");
    const company_id = localStorage.getItem("company_id");

    if (!token || !company_id) {
      toastr.error("Token atau Company ID tidak ditemukan.");
      return;
    }

    try {
      const payload = {
        ...formData,
        founded_year: parseInt(formData.founded_year),
        employee_daily_point: parseInt(formData.employee_daily_point),
        company_id: parseInt(company_id),
      };

      await createBrands(payload, token);
      toastr.success("Data Brand Berhasil Ditambahkan.");
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Gagal menambahkan brand.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Gagal menambahkan brand.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.brand_name.trim())
      newErrors.brand_name = "Brand Name is required";
    if (!formData.employee_daily_point.trim())
      newErrors.employee_daily_point = "Employee Daily Point is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
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
              Brand Name
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
              Employee Daily Point
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
              Logo
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Website URL"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Email
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
              placeholder="Input Email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Phone
            </label>
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Phone"
            />
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
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Founded Year
            </label>
            <input
              type="date"
              name="founded_year"
              value={formData.founded_year}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
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
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                errors.country
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-300"
              }`}
              placeholder="Input Country"
            />
            {errors.country && (
              <p className="text-sm text-red-600 mt-1">{errors.country}</p>
            )}
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
              Address
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
