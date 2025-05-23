"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrands } from "@/service/brand/brandService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import axios from "axios";

type AddBrandFormProps = {
  onClose: () => void;
};

export default function AddBrandForm({ onClose }: AddBrandFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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

      const response = await createBrands(payload, token);
      console.log("Response dari server:", response.data);
      console.log("Payload yang dikirim:", payload);
      toastr.success("Data Brand Berhasil Ditambahkan.");
      onClose();
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        toastr.error(
          "Gagal menambahkan brand.",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Unexpected error:", error);
        toastr.error("Gagal menambahkan brand.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add New Brand</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                { label: "Brand Name", name: "brand_name" },
                {
                  label: "Employee Daily Point",
                  name: "employee_daily_point",
                  type: "number",
                },
                { label: "Logo URL", name: "logo_url" },
                { label: "Description", name: "description" },
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
              ] as {
                label: string;
                name: keyof typeof formData;
                type?: string;
              }[]
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
    </>
  );
}
