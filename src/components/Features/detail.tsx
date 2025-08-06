import { featureData } from "@/constants/featuresData";
import { detailFeatures } from "@/service/features/featuresService";
import { useEffect, useState } from "react";

type FeatureDetailProps = {
  onClose: () => void;
  featureId: string;
};

export default function FeatureDetailPage({
  onClose,
  featureId,
}: FeatureDetailProps) {
  const [features, setFeatures] = useState<featureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!featureId) return;

    const fetchFeatureDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await detailFeatures(token || "", featureId);
        setFeatures(res.data.data);
      } catch (error) {
        console.error("Failed to get features data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureDetail();
  }, [featureId]);
  return loading ? (
    <p className="p-4">Connecting...</p>
  ) : features ? (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-black mb-4">Detail Features</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Feature Name
            </label>
            <input
              type="text"
              name="name"
              value={features.name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter feature name"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="is_active"
              value={features.is_active ? "true" : "false"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              disabled
            >
              <option value="" disabled>
                -- Select Status --
              </option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={features.description}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Input Description"
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
      </form>
    </div>
  ) : (
    <p className="p-4 text-red-500">Data tidak ditemukan.</p>
  );
}
