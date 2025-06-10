/* eslint-disable @next/next/no-img-element */
"use client";
import { BrandData } from "@/constants/brandData";
import { detailBrands } from "@/service/brand/brandService";
import { useEffect, useState } from "react";

type BrandDetailProps = {
  onClose: () => void;
  brandId: string;
};

export default function BrandDetailPage({
  onClose,
  brandId,
}: BrandDetailProps) {
  const [brands, setBrands] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brandId) return;

    const fetchBrandDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await detailBrands(token || "", brandId);
        console.log("ini data :", res);
        setBrands(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data brand:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetail();
  }, [brandId]);

  return loading ? (
    <p className="p-4">Memuat data brand...</p>
  ) : brands ? (
    <div className="relative z-10 overflow-y-auto max-h-[90vh] p-4">
      <h2 className="text-xl font-bold text-black mb-4">Detail Brand</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand Name
            </label>
            <input
              type="text"
              name="brand_name"
              value={brands.brand_name}
              disabled
              className="bg-gray-100 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Daily Point
            </label>
            <input
              type="number"
              name="employee_daily_point"
              value={brands.employee_daily_point}
              disabled
              className="bg-gray-100 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            {brands.logo_url && (
              <img
                src={brands.logo_url}
                alt="Preview Logo"
                className="mt-2 h-24 object-contain border rounded"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={brands.description}
              disabled
              rows={4}
              className="bg-gray-100 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            />
          </div>
          {(
            [
              { label: "Website URL", name: "website_url" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Industry", name: "industry" },
              { label: "Founded Year", name: "founded_year" },
              { label: "Headquarter City", name: "headquarter_city" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Province", name: "province" },
              { label: "Postal Code", name: "postal_code" },
              { label: "Country", name: "country" },
              { label: "Owner Name", name: "owner_name" },
            ] as { label: string; name: keyof typeof brands }[]
          ).map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                value={
                  typeof brands[name] === "boolean"
                    ? brands[name]
                      ? "true"
                      : "false"
                    : brands[name] ?? ""
                }
                disabled
                className="bg-gray-100 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="text-white px-4 py-2 rounded-2xl bg-gray-600 hover:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </form>
    </div>
  ) : (
    <p className="p-4 text-red-500">Data tidak ditemukan.</p>
  );
}
