"use client";
import { menus } from "@/constants/menus";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 md:w-80 text-white p-6 md:p-8 rounded-3xl shadow-lg min-h-full z-50 bg-opacity-30 backdrop-blur-md border-5 fixed md:static top-0 left-0 bg-blue-900 transition-transform md:transform-none"
      style={{
        background:
          "linear-gradient(187.7deg, rgba(7, 61, 170, 0.3) 11.88%, rgba(26, 42, 108, 0.3)88.12%)",
        borderColor: "#A7CBF0",
      }}
    >
      <div className="md:hidden flex justify-end mb-4">
        <button onClick={onClose} className="text-white text-2xl">
          ×
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">North Eyes</h1>
      <ul>
        {menus.map((menu) => {
          const isActive = pathname === menu.url;
          return (
            <li key={menu.id} className="mb-2">
              <Link
                href={menu.url}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-blue-900 transition-transform duration-300 ease-in-out hover:scale-110 ${
                  isActive ? "is-active-menu" : ""
                }`}
                onClick={onClose}
              >
                <span className="text-lg w-6 flex justify-center items-center">
                  {menu.icon}
                </span>
                <span
                  className={`text-base ${
                    isActive ? "font-semibold text-blue-600" : "text-white/80"
                  } whitespace-nowrap`}
                >
                  {menu.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
