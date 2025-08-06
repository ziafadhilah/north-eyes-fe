/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import Pagination from "@/components/General/Pagination/Pagination";
import { useEffect, useState } from "react";
import AddUserForm from "./add_user";
import {
  deleteUser,
  fetchUserManagement,
} from "@/service/user-management/userManagement";
import { userManagementData } from "@/constants/userManagementData";
import { useRouter } from "next/navigation";
import EditUserManagementForm from "./edit";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { UserManagementDetail } from "./detail";

export default function SlugPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [users, setUsers] = useState<userManagementData[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<userManagementData | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userManagementData | null>(
    null
  );

  const [userToDelete, setUserToDelete] = useState<userManagementData | null>(
    null
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const openEditModal = (user: userManagementData) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenDetail = (user: userManagementData) => {
    setSelectedUser(user);
    openDetailModal();
  };

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const loadUserManagement = async (page: number) => {
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";

    try {
      const response = await fetchUserManagement(token, page);

      if (response.data.status === "success") {
        const responseData = response.data.data;
        setTimeout(() => {
          setUsers(responseData.users || []);
          setTotalPages(responseData.pages || 1);
          setIsLoading(false);
        }, 1000);
      } else {
        toastr.error("Error fetching users data");
        setIsLoading(false);
      }
    } catch (error) {
      toastr.error("Error while fetching users data");
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const token = localStorage.getItem("token") || "";

    try {
      const res = await deleteUser(token, userId);
      if (res.data.status === "success") {
        toastr.success("User deleted successfully");
        setTimeout(() => window.location.reload(), 500);
        loadUserManagement(currentPage);
      } else {
        toastr.error("Failed to delete user");
      }
    } catch (error) {
      toastr.error("Error occurred while deleting user");
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadUserManagement(currentPage);
  }, [currentPage]);

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-5 w-full p-2">
          <div className="flex items-center">
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Manage User
              </h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              {dayName}
            </span>
            <p className="text-md font-medium text-black mt-4">
              {dateTimeString}
            </p>
          </div>
        </div>

        <div className="ml-10 flex items-center justify-between mb-5">
          <div className="flex gap-4">&nbsp;</div>
          <button
            onClick={openModal}
            className="text-white p-2 bg-blue-600 rounded-xl shadow-sm flex items-center justify-center hover:scale-102 hover:bg-blue-500"
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined">add</span>
              <span className="text-md font-medium text-white">
                Add User&nbsp;
              </span>
            </div>
          </button>
        </div>

        <div className="w-full overflow-x-auto border rounded-lg shadow-sm bg-white p-2">
          <table className="w-full text-sm text-left text-gray-700 min-w-[700px]">
            <thead className="text-gray-700 text-center">
              <tr>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading... Please wait</span>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((data) => (
                  <tr key={data.user_id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{data.user_id}</td>
                    <td className="py-3 px-4">{data.full_name}</td>
                    <td className="py-3 px-4">{data.email}</td>
                    <td className="py-3 px-4">{data.phone_number}</td>
                    <td className="py-3 px-4 flex flex-row">
                      <button
                        className="cursor-pointer hover:bg-gray-100 text-blue-500 px-3 py-1"
                        title="View"
                        onClick={() => handleOpenDetail(data)}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-yellow-500"
                        title="Edit"
                        onClick={() => openEditModal(data)}
                      >
                        <span className="material-symbols-outlined">
                          draft_orders
                        </span>
                      </button>
                      <button
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-red-500"
                        title="Delete"
                        onClick={() => {
                          setUserToDelete(data);
                          setIsConfirmDeleteOpen(true);
                        }}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No users data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </Main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddUserForm onClose={closeModal} />
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={closeDetailModal}>
        {selectedUser ? (
          <UserManagementDetail
            userId={selectedUser.user_id}
            onClose={closeDetailModal}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        {userToEdit ? (
          <EditUserManagementForm
            userData={userToEdit}
            onClose={closeEditModal}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

      <Modal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
      >
        <div className="p-2">
          <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this user?</p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded-xl"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-xl"
              onClick={() => {
                if (userToDelete) {
                  handleDelete(userToDelete.user_id.toString());
                  setIsConfirmDeleteOpen(false);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
