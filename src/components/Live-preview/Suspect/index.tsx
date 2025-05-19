/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import Main from "@/components/General/Layout/Main";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SuspectPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;

  const defaultTab = searchParams.get("tab") || "kitchen";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab); // Sync saat query berubah
  }, [defaultTab]);

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <Link
              href={{
                pathname: `/brand/live-preview/${id}`,
                query: { tab: activeTab },
              }}
            >
              <span
                className="material-symbols-outlined mr-5"
                style={{ fontSize: "32px" }}
              >
                arrow_back
              </span>
            </Link>

            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Violation
              </h1>
              <nav
                className="text-sm text-gray-500 mt-1"
                aria-label="breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/brand" className="hover:underline">
                      Brand
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">Live View</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              Wednesday
            </span>
            <p className="text-md font-medium text-black mt-4">
              10:00 AM, 04 April 2025
            </p>
          </div>
        </div>
        <div className="">
          <div className="flex gap-4 mb-5">
            {["kitchen", "bar", "parking area"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 -mb-px border-b-2 font-medium capitalize transition duration-200 ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-start justify-between mb-3 w-full">
            <h1 className="text-2xl font-bold mb-4">
              Suspect{" "}
              <span className="text-white text-sm me-2 text-center font-medium px-2.5 py-1 rounded-md ne-accent">
                200
              </span>
            </h1>

            <div className="text-right">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-blue-600 w-6 h-6" />
                <h1 className="text-black text-md">Auto Valid</h1>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md p-4 bg-white flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    Uniform (Case #{index + 101})
                  </h2>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                </div>

                {/* Image & Details */}
                <div className="flex gap-4">
                  {/* Image */}
                  <img
                    src="/static/images/bg_login.png"
                    className="w-75 h-50 object-cover rounded-md"
                  />

                  {/* Info */}
                  <div className="flex-1 text-sm space-y-1">
                    {/* Violation & Supervisor */}
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">
                        Violation
                      </span>
                      <span className="text-gray-600">Supervisor</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">No Wearing Apron</span>
                      <span className="text-green-600 font-semibold">
                        Valid
                      </span>
                      {/* atau Invalid */}
                    </div>

                    {/* Date & Type */}
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500">16-04-2025 10:00AM</span>
                      <div className="flex gap-1 text-xs">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                          Low
                        </span>
                        <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                          Med
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          High
                        </span>
                      </div>
                    </div>

                    {/* Area */}
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">Area:</span> Kitchen
                      </p>
                    </div>
                  </div>
                </div>

                {/* Similarity */}
                <div className="mt-2 text-sm">
                  <p className="font-medium mb-1">Similarity:</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`similarity-${index}`}
                        className="accent-blue-600"
                      />
                      James
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`similarity-${index}`}
                        className="accent-blue-600"
                      />
                      Charlie
                    </label>
                  </div>
                </div>

                {/* Note */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note:
                  </label>
                  <input
                    type="text"
                    placeholder="Tambahkan catatan"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Main>
    </div>
  );
}
