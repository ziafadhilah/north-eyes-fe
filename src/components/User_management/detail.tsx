/* eslint-disable @next/next/no-img-element */
"use-client";

import { userManagementData } from "@/constants/userManagementData";
import { showUsersManagement } from "@/service/user-management/userManagement";
import { useEffect, useState } from "react";

type userManagementProps = {
  onClose: () => void;
  userId: string;
};

export function UserManagementDetail({ onClose, userId }: userManagementProps) {
  const [user, setUser] = useState<userManagementData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await showUsersManagement(token || "", userId);
        setUser(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId]);

  return loading ? (
    <p className="p-4">Memuat data...</p>
  ) : user ? (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-black mb-4">Detail User</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={user.full_name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={user.username}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={user.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              value={user.phone_number}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Picture
            </label>
            {user.profile_picture_url && (
              <img
                src={user.profile_picture_url}
                alt="Preview Logo"
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
      </form>
    </div>
  ) : (
    <p className="p-4 text-red-500">Data tidak ditemukan.</p>
  );
}
