/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrands } from "@/service/brand/brandService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { uploadLogo } from "@/service/upload/uploadService";

type AddBrandFormProps = {
  onClose: () => void;
};

export default function AddBrandForm({ onClose }: AddBrandFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

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

    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toastr.error(`Ukuran logo tidak boleh lebih dari ${maxSizeInMB}MB.`);
      return;
    }

    // Validasi tipe file
    // const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    // if (!allowedTypes.includes(file.type)) {
    //   toastr.error("Format file harus JPG atau PNG.");
    //   return;
    // }

    setPreviewLogo(URL.createObjectURL(file));
    setLogoFile(file);

    try {
      const result = await uploadLogo(file);
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
    const company_id = localStorage.getItem("company_id");

    if (!token || !company_id) {
      alert("Token atau Company ID tidak ditemukan.");
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
      console.log(payload);
      toastr.success("Data Brand Berhasil Ditambahkan.");
      onClose();
      router.refresh();
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

  return (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-black mb-4">Add New Brand</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand Name
            </label>
            <input
              type="text"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Brand Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Daily Point
            </label>
            <input
              type="number"
              name="employee_daily_point"
              value={formData.employee_daily_point}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Employee Daily Point"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-1 block w-full"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Description"
              required
            />
          </div>
          {(
            [
              { label: "Website URL", name: "website_url" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Industry", name: "industry" },
              { label: "Founded Year", name: "founded_year", type: "date" },
              { label: "Headquarter City", name: "headquarter_city" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Province", name: "province" },
              { label: "Postal Code", name: "postal_code" },
              { label: "Country", name: "country" },
              { label: "Owner Name", name: "owner_name" },
            ] as { label: string; name: keyof typeof formData; type?: string }[]
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
  );
}
