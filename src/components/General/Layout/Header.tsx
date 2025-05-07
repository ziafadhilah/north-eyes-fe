/* eslint-disable @next/next/no-img-element */
"use client";
export default function Header() {
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
        <img
          src="/static/images/user_avatar.png"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border"
        />
        <div className="flex flex-col">
          <span className="text-gray-800 font-medium">User</span>
          <span
            className="bg-blue-100 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-md"
            style={{ backgroundColor: "rgba(0, 128, 128, 1)" }}
          >
            Super Admin
          </span>
        </div>
      </div>
    </header>
  );
}
