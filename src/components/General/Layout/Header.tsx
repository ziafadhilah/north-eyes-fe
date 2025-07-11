/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function Header({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [companyPhoto, setCompanyPhoto] = useState<string | null>(null);

  useEffect(() => {
    setCompanyName(localStorage.getItem("company"));
    setCompanyPhoto(localStorage.getItem("photo_url"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toastr.success("Logout Successful");
    router.replace("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-2 p-2">
      <button
        className="lg:hidden text-white text-3xl transition-transform duration-300 ease-in-out hover:scale-120"
        onClick={onToggleSidebar}
      >
        ☰
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <div
          className="w-10 h-10 rounded-md flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
          style={{ backgroundColor: "rgba(0, 128, 128, 1)" }}
        >
          <span className="material-symbols-outlined text-white text-xl">
            circle_notifications
          </span>
        </div>
        <div
          className="w-10 h-10 rounded-md flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
          style={{ backgroundColor: "rgba(212, 175, 55, 1)" }}
        >
          <span className="material-symbols-outlined text-white text-xl">
            settings
          </span>
        </div>

        {/* User Info */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={
                companyPhoto ? companyPhoto : "/static/images/user_avatar.png"
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div className="hidden md:flex flex-col">
              <span className="text-gray-800 font-medium uppercase">
                {companyName}
              </span>
              <span
                className="text-sm rounded-md text-white uppercase font-medium"
                // style={{ backgroundColor: "rgba(0, 128, 128, 1)" }}
              >
                Super Admin
              </span>
            </div>
          </div>

          {dropdownOpen && (
            <div className="mt-2 absolute right-0 min-w-[15rem] bg-white rounded-md shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-2 text-sm text-gray-400">Account</div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
