/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Main from "@/components/General/Layout/Main";
import { RegistrationData } from "@/constants/registrationData";
import { fetchRegistration } from "@/service/customer-registration/registrationService";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/components/General/Pagination/Pagination";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function RegistrationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState<RegistrationData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const loadRegistration = async (page: number) => {
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";

    try {
      const response = await fetchRegistration(token, page);

      if (response.data.status === "success") {
        const responseData = response.data.data;
        console.log(responseData);
        setTimeout(() => {
          setRegistration(responseData.data || []);
          setTotalPages(responseData.pages || 1);
          setIsLoading(false);
        }, 1000);
      } else {
        toastr.error("Error fetching registration data");
        setIsLoading(false);
      }
    } catch (error) {
      toastr.error("Error while fetching registration data");
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadRegistration(currentPage);
  }, [currentPage]);

  return (
    <Main>
      <div className="flex items-start justify-between mb-5 w-full">
        <div className="flex items-center">
          <div className="mb-3">
            <h1 className="text-3xl font-bold text-title-color mb-2">
              Customer Registration
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

      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <div className="overflow-hidden rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading... Please wait</span>
                    </div>
                  </td>
                </tr>
              ) : registration.length > 0 ? (
                registration.map((data) => (
                  <tr
                    key={data.registration_id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{data.full_name}</td>
                    <td className="py-3 px-4">{data.email}</td>
                    <td className="py-3 px-4">{data.phone}</td>
                    <td className="py-3 px-4">{data.message}</td>
                    <td className="py-3 px-4">
                      <button className="text-black px-3 py-1" title="View">
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button className="text-black px-3 py-1" title="Edit">
                        <span className="material-symbols-outlined">
                          draft_orders
                        </span>
                      </button>
                      <button className="text-black px-3 py-1" title="Delete">
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
                    colSpan={5}
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No registration data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Main>
  );
}
