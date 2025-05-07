"use client";
import { menus } from "@/constants/menus";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="w-64 text-white p-8 rounded-3xl shadow-lg min-h-screen border-5"
      style={{
        background:
          "linear-gradient(187.7deg, rgba(7, 61, 170, 0.3) 11.88%, rgba(26, 42, 108, 0.3)88.12%)",
        borderColor: "#A7CBF0",
      }}
    >
      <h1 className="text-2xl font-bold mb-6">North Eyes</h1>
      <ul>
        {menus.map((menu) => {
          const isActive = pathname === menu.url;
          return (
            <li key={menu.id} className="mb-2">
              <Link
                href={menu.url}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-blue-900 ${
                  isActive ? "bg-blue-900" : ""
                }`}
              >
                <span className="text-white">{menu.icon}</span>
                <span>{menu.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
