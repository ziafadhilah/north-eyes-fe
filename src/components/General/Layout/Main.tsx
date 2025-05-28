"use client";
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Main({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex flex-col md:flex-row min-h-screen"
      style={{
        background: "linear-gradient(180deg, #A7CBF0 0%, #1A2A6C 100%)",
      }}
    >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="flex-1 rounded-3xl shadow-2xl p-4 md:p-8 border-5"
          style={{
            backgroundColor: "rgba(243, 243, 243, 1)",
            borderColor: "#A7CBF0",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
