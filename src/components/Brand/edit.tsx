/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { uploadLogoBrand } from "@/service/brand/uploadBrandService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";
import { EditBrandData } from "@/constants/brandData";
import { updateBrands } from "@/service/brand/brandService";
import RegionSelect, { OptionType } from "@/components/General/Region/Region";

type EditBrandFormProps = {
  brandData: EditBrandData;
  onClose: () => void;
};

export default function EditBrandForm({
  brandData,
  onClose,
}: EditBrandFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(
    brandData.logo_url || null
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({ ...brandData });

  const [selectedProvince, setSelectedProvince] = useState<OptionType | null>({
    value: brandData.province_id,
    label: brandData.province,
  });

  const [selectedRegency, setSelectedRegency] = useState<OptionType | null>({
    value: brandData.regency_id,
    label: brandData.city,
  });

  const handleProvinceChange = (province: OptionType) => {
    setSelectedProvince(province);
    setFormData((prev) => ({
      ...prev,
      province: province.label,
      province_id: province.value,
      city: "",
      regency_id: 0,
    }));
  };

  const handleRegencyChange = (regency: OptionType) => {
    setSelectedRegency(regency);
    setFormData((prev) => ({
      ...prev,
      city: regency.label,
      regency_id: regency.value,
    }));
  };

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
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan.");
      return;
    }

    try {
      const payload = {
        ...formData,
        founded_year: formData.founded_year,
        employee_daily_point: formData.employee_daily_point,
      };

      const res = await updateBrands(payload, token, brandData.brand_id);
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
    <div className="relative z-10 overflow-y-auto max-h-[90vh] p-4">
      <h2 className="text-xl font-bold text-black mb-4">Edit Brand</h2>
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
              required
            />
          </div>

          <div>
            <label
              htmlFor="logo-upload"
              className="cursor-pointer px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 inline-block"
            >
              Choose Logo
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Input Description"
              required
            />
          </div>

          <RegionSelect
            initialProvince={selectedProvince}
            initialRegency={selectedRegency}
            onProvinceChange={handleProvinceChange}
            onRegencyChange={handleRegencyChange}
          />

          {(
            [
              { label: "Website URL", name: "website_url" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Industry", name: "industry" },
              {
                label: "Founded Year",
                name: "founded_year",
                type: "year-select",
              },
              { label: "Headquarter City", name: "headquarter_city" },
              { label: "Address", name: "address" },
              // { label: "City", name: "city" },
              // { label: "Province", name: "province" },
              { label: "Postal Code", name: "postal_code" },
              { label: "Country", name: "country" },
              { label: "Owner Name", name: "owner_name" },
            ] as { label: string; name: keyof typeof formData; type?: string }[]
          ).map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              {type === "year-select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  required
                >
                  <option value="">Pilih Tahun</option>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={`Input ${label}`}
                  required
                />
              )}
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
            {isLoading ? "Menyimpan..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
