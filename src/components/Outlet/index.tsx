/* eslint-disable @next/next/no-img-element */
"use client";
import { brandsData } from "@/constants/dummydata";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Main from "@/components/General/Layout/Main";

export default function OIndex() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const brand = brandsData.find((data) => data.id === id);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <Main>
        <h1 className="text-3xl text-black font-bold">Live View</h1>
        <nav className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2 items-center">
            <li>
              <Link href="/home" className="hover:underline">
                Home
              </Link>
            </li>
            <span className="material-symbols-outlined">chevron_right</span>
            <li>
              <Link href={`/home/${brand?.id}`} className="hover:underline">
                {brand?.name}
              </Link>
            </li>
            <span className="material-symbols-outlined">chevron_right</span>
            <li className="text-gray-700 font-medium">
              {brand?.kitchen[0].name}
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {brand?.kitchen.map((kitchen, index) => (
            <div key={kitchen.id} className="relative w-full max-w-sm">
              <Link
                key={index}
                href={`/home/live-preview/${brand.id}`}
                passHref
                className="w-full max-w-sm p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center bg-radial-blue"
              >
                <img
                  src="/static/images/ex_brand.png"
                  alt={brand.name}
                  className="w-50 h-50 mb-3"
                />
                <p className="font-bold text-black">{kitchen.name}</p>
                <p className="text-gray-600">{brand.address}</p>
              </Link>

              <div
                className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveDropdown(
                    activeDropdown === kitchen.id ? null : kitchen.id
                  );
                }}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </div>

              {activeDropdown === kitchen.id && (
                <div
                  ref={dropdownRef}
                  className="absolute top-10 right-2 bg-white border border-gray-300 shadow-md rounded-md w-32 z-20"
                >
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      console.log("Edit", kitchen.name);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setActiveDropdown(null);
                      console.log("Delete", kitchen.name);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Main>
    </div>
  );
}
