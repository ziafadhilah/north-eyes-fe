/* eslint-disable @next/next/no-img-element */
"use client";
import { OutletData } from "@/constants/outletData";
import { detailOutlet } from "@/service/outlet/outletService";
import { useEffect, useState } from "react";

type OutletDetailProps = {
  onClose: () => void;
  outletId: string;
};

export default function OutletDetailPage({
  onClose,
  outletId,
}: OutletDetailProps) {
  const [outlet, setOutlet] = useState<OutletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!outletId) return;

    const fetchOutletDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await detailOutlet(token || "", outletId);
        console.log("ini data :", res);
        setOutlet(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data brand:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutletDetail();
  }, [outletId]);

  return loading ? (
    <p className="p-4">Memuat data outlet...</p>
  ) : outlet ? (
    <div className="relative z-10 overflow-y-auto max-h-[90vh] p-4">
      <h2 className="text-xl font-bold text-black mb-4">Detail Outlet</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              { label: "Outlet Name", name: "outlet_name" },
              { label: "Email", name: "email" },
              { label: "Phone", name: "phone" },
              { label: "Address", name: "address" },
              { label: "City", name: "city" },
              { label: "Province", name: "province" },
              { label: "Postal Code", name: "postal_code" },
              { label: "Country", name: "country" },
            ] as { label: string; name: keyof typeof outlet }[]
          ).map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                value={
                  typeof outlet[name] === "boolean"
                    ? outlet[name]
                      ? "true"
                      : "false"
                    : outlet[name] ?? ""
                }
                disabled
                className="bg-gray-100 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Logo
          </label>
          {outlet.logo_url && (
            <img
              src={outlet.logo_url}
              alt="Preview Logo"
              className="mt-2 h-24 object-contain border rounded"
            />
          )}
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
