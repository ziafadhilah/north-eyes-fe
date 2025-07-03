"use client";
import Main from "@/components/General/Layout/Main";
import Modal from "@/components/General/Modal/Modal";
import { useState } from "react";
import AddFeaturesForm from "./add";
// import AddUserForm from "./add_user";

export default function FeaturesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-5 w-full">
          <div className="flex items-center">
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Manage Features
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

        <div className="text-right mb-3">
          <button
            onClick={openModal}
            className="text-white p-2 bg-blue-600 rounded-xl shadow-sm hover:scale-105 hover:bg-blue-500"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <div className="overflow-hidden rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Slug ID</th>
                  <th className="py-3 px-4">Company ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">123123</td>
                  <td className="py-3 px-4">123</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">Example Name</td>
                  <td className="py-3 px-4">Example Username</td>
                  <td className="py-3 px-4">email@email.com</td>
                  <td className="py-3 px-4">085220222222</td>
                  <td className="py-3 px-4">
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        draft_orders
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">123123</td>
                  <td className="py-3 px-4">123</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">Example Name</td>
                  <td className="py-3 px-4">Example Username</td>
                  <td className="py-3 px-4">email@email.com</td>
                  <td className="py-3 px-4">085220222222</td>
                  <td className="py-3 px-4">
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        draft_orders
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">123123</td>
                  <td className="py-3 px-4">123</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">Example Name</td>
                  <td className="py-3 px-4">Example Username</td>
                  <td className="py-3 px-4">email@email.com</td>
                  <td className="py-3 px-4">085220222222</td>
                  <td className="py-3 px-4">
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        draft_orders
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
                <tr className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">123123</td>
                  <td className="py-3 px-4">123</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">Example Name</td>
                  <td className="py-3 px-4">Example Username</td>
                  <td className="py-3 px-4">email@email.com</td>
                  <td className="py-3 px-4">085220222222</td>
                  <td className="py-3 px-4">
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">
                        draft_orders
                      </span>
                    </button>
                    <button className="text-black px-3 py-1">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AddFeaturesForm />
      </Modal>
    </div>
  );
}
