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
      const result = await uploadLogoOutlet(file);
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
      };

      await createOutlet(payload, token);
      console.log(payload);
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
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add Outlet</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Outlet Name
              </label>
              <input
                type="text"
                name="outlet_name"
                value={formData.outlet_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Input Outlet Name"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Input Email"
              />
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
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Input Country"
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
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Input Address"
              />
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
