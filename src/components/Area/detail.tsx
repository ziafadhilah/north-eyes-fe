/* eslint-disable @next/next/no-img-element */
"use-client";

import { AreaData } from "@/constants/areaData";
import { detailAreas } from "@/service/area/areaService";
import { useEffect, useState } from "react";

type AreaDetailProps = {
  onClose: () => void;
  areaId: string;
};

export default function AreaDetailPage({ onClose, areaId }: AreaDetailProps) {
  const [areas, setAreas] = useState<AreaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!areaId) return;
    const fetchAreaDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await detailAreas(token || "", areaId);
        console.log("ini data :", res);
        setAreas(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data brand:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreaDetail();
  }, [areaId]);
  return loading ? (
    <p className="p-4">Memuat data brand...</p>
  ) : areas ? (
    <div className="relative z-10 overflow-y-auto max-h-[90vh] p-4">
      <h2 className="text-xl font-bold text-black mb-4">Detail Area</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(
          [
            { label: "Area Name", name: "area_name" },
            { label: "Description", name: "description" },
          ] as { label: string; name: keyof typeof areas }[]
        ).map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type="text"
              value={
                typeof areas[name] === "boolean"
                  ? areas[name]
                    ? "true"
                    : "false"
                  : areas[name] ?? ""
              }
              disabled
              className="bg-gray-100 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image Cover
          </label>
          {areas.logo_url && (
            <img
              src={areas.logo_url}
              alt="Preview Image"
              className="mt-2 h-24 object-contain border rounded"
            />
          )}
        </div>
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
    </div>
  ) : (
    <p className="p-4 text-red-500">Data tidak ditemukan.</p>
  );
}
