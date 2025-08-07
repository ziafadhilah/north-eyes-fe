/* eslint-disable @next/next/no-img-element */
"use client";
import { createOutlet } from "@/service/outlet/outletService";
import { uploadLogoOutlet } from "@/service/outlet/uploadOutletService";
import { useState, useEffect, useRef } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import RegionSelect, { OptionType } from "@/components/General/Region/Region";

type AddOutletFormProps = {
  onClose: () => void;
  brandId: string;
};

export default function AddOutletForm({
  onClose,
  brandId,
}: AddOutletFormProps) {
  const autoFocusRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    outlet_name: "",
    logo_url: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    brand_id: brandId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!value.startsWith("+62")) {
      value = "+62" + value.replace(/\D/g, "");
    } else {
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
      const result = await uploadLogoOutlet(file);
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
      };

      await createOutlet(payload, token);
      console.log(payload);
      toastr.success("Outlet has been created.");
      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toastr.error(
          "Failed to add outlet.",
          error.response?.data?.message || error.message
        );
      } else {
        toastr.error("Failed to add outlet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.outlet_name.trim()) {
      newErrors.outlet_name = "Outlet Name is required";
    } else if (/\d/.test(formData.outlet_name)) {
      newErrors.outlet_name = "Outlet Name cannot contain numbers";
    } else if (formData.outlet_name.length > 255) {
      newErrors.outlet_name = "Outlet Name max 255 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email is not valid";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+62|62|08)[0-9]{8,13}$/.test(formData.phone)) {
      newErrors.phone =
        "Phone number must start with +62, 62, or 08 and contain 10–15 digits total";
    } else if (/^(\d)\1+$/.test(formData.phone)) {
      newErrors.phone = "Phone number cannot contain repeated digits";
    }

    if (formData.address.length > 255) {
      newErrors.address = "Address max 255 characters";
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
    setFormData((prev) => ({ ...prev, brand_id: brandId }));
  }, [brandId]);

  useEffect(() => {
    if (autoFocusRef.current) {
      autoFocusRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="relative z-10 overflow-y-auto max-h-[90vh] p-4">
        <h2 className="text-xl font-bold text-black mb-4">Add Outlet</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Outlet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="outlet_name"
                value={formData.outlet_name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.outlet_name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="Input Outlet Name"
              />
              {errors.outlet_name && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.outlet_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
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
                placeholder="e.g : example@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
                Phone
                <span className="text-gray-500">(e.g : +621234567890)</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Input Phone e.g : +621234567890"
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
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
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring ${
                  errors.postal_code
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-300"
                }`}
                placeholder="Input Postal Code"
              />
              {errors.postal_code && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.postal_code}
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
              {isLoading ? "Menyimpan..." : "Add Outlet"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
