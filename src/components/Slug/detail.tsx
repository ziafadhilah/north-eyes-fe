"use client";

import { SlugData } from "@/constants/slugData";
import { detailSlug } from "@/service/slug/slugService";
import { useEffect, useState } from "react";

type SlugDetailProps = {
  onClose: () => void;
  slugId: number;
};

export default function SlugDetailPage({ onClose, slugId }: SlugDetailProps) {
  const [slug, setSlug] = useState<SlugData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugId) return;

    const fetchSlugDetail = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const res = await detailSlug(token, slugId.toString());
        setTimeout(() => {
          setSlug(res.data.data || []);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Failed to get data:", error);
        setLoading(false);
      }
    };

    fetchSlugDetail();
  }, [slugId]);

  return loading ? (
    <p className="p-4">Memuat data slug...</p>
  ) : slug ? (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-black mb-4">Detail Slug</h2>
      <div className="space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={slug?.slug_name}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug URL
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={slug?.slug}
            disabled
          />
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
