/* eslint-disable @next/next/no-img-element */
"use client";
import { brandsData } from "@/constants/dummydata";
import Sidebar from "../General/Layout/Sidebar";
import { useParams } from "next/navigation";
import Link from "next/link";
import Main from "../General/Layout/Main";

export default function BrandDetails() {
  const params = useParams();
  const id = parseInt(params?.id as string);
  const brand = brandsData.find((data) => data.id === id);

  if (!brand) {
    return (
      <div className="flex min-h-screen bg-white p-4">
        <Sidebar />
        <div className="flex-1 p-10 text-red-600">
          Brand dengan ID {id} tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Main>
        <h1 className="text-3xl text-black font-bold">List Outlet</h1>
        <nav className="text-sm text-gray-500 mb-6" aria-label="breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2 items-center">
            <li>
              <Link href="/home" className="hover:underline">
                Home
              </Link>
            </li>
            <span className="material-symbols-outlined">chevron_right</span>
            <li className="text-gray-700 font-medium">{brand.name}</li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {brand.outlet.map((outletName, index) => (
            <Link
              key={index}
              href={`outlet/${brand.id}`}
              passHref
              className="w-full max-w-sm p-4 bg-radial-blue-2 rounded-lg shadow-xl flex flex-col items-center justify-center text-center hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              <img
                src="/static/images/ex_brand.png"
                alt={brand.name}
                className="w-50 h-50 mb-3"
              />
              <p className="font-bold text-black">{outletName}</p>
              <p className="text-gray-600">{brand.address}</p>
            </Link>
          ))}
        </div>
      </Main>
    </div>
  );
}
