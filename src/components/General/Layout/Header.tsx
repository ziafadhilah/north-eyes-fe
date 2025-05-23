/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token"); // sesuaikan key jika beda
    router.push("/login"); // arahkan ke halaman login
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
    <header className="bg-transparent p-1 flex justify-between items-center mb-4">
      <div className="text-xl font-semibold text-black"></div>
      <div className="flex items-center gap-4">
        <div
          className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-blue-300 transition duration-300 ease-in-out cursor-pointer"
          style={{ backgroundColor: "rgba(0, 128, 128, 1)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "white",
              fontSize: "30px",
            }}
          >
            circle_notifications
          </span>
        </div>
        <div
          className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-blue-300 transition duration-300 ease-in-out cursor-pointer"
          style={{ backgroundColor: "rgba(212, 175, 55, 1)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: "white",
              fontSize: "28px",
            }}
          >
            settings
          </span>
        </div>
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Avatar + Info */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="/static/images/user_avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div className="flex flex-col">
              <span className="text-gray-800 font-medium">User</span>
              <span
                className="bg-blue-100 text-white text-xs font-medium px-2.5 py-0.5 rounded-md"
                style={{ backgroundColor: "rgba(0, 128, 128, 1)" }}
              >
                Super Admin
              </span>
            </div>
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-14 w-40 bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
