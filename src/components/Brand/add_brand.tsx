"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrands } from "@/service/brand/brandService";

export default function AddBrandForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    brand_name: "",
    logo_url: "", // bisa diganti dengan upload handling jika perlu
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
      alert("Brand berhasil ditambahkan!");
      router.push("/brand");
    } catch (error: any) {
      console.error("Gagal menambahkan brand:", error);
      alert("Gagal menambahkan brand");
    }
  };

  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add New Brand</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Brand Name", name: "brand_name" },
              { label: "Employee Daily Point", name: "employee_daily_point" },
              { label: "Logo URL", name: "logo_url" },
              { label: "Description", name: "description" },
              { label: "Website URL", name: "website_url" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Industry", name: "industry" },
              { label: "Founded Year", name: "founded_year", type: "number" },
              { label: "Headquarter City", name: "headquarter_city" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Province", name: "province" },
              { label: "Postal Code", name: "postal_code" },
              { label: "Country", name: "country" },
              { label: "Owner Name", name: "owner_name" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  placeholder={`Enter ${label}`}
                  required
                />
              </div>
            ))}
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
              style={{
                background:
                  "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
              }}
            >
              Add Brand
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
