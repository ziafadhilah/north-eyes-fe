"use client";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useRouter } from "next/navigation";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function Main({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // const TIMEOUT = 2000;
    const TIMEOUT = 10 * 60 * 1000;
    let timeoutId: NodeJS.Timeout;

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("company");
      localStorage.removeItem("company_id");
      localStorage.removeItem("photo_url");
      localStorage.removeItem("lastActivity");

      toastr.options = {
        timeOut: 10000,
        extendedTimeOut: 2000,
        closeButton: true,
        progressBar: true,
      };

      toastr.info("You've been logged out due to 10 minutes of inactivity.");
      router.push("/login");
    };

    const resetTimer = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, TIMEOUT);
    };

    const last = localStorage.getItem("lastActivity");
    if (last && Date.now() - parseInt(last, 10) > TIMEOUT) {
      logout();
      return;
    }

    const activityEvents = ["mousemove", "keydown", "click", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    timeoutId = setTimeout(logout, TIMEOUT);

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{
        background: "linear-gradient(180deg, #A7CBF0 0%, #1A2A6C 100%)",
      }}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:translate-x-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-2 min-h-screen overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div
          className="flex-1 overflow-y-auto rounded-3xl shadow-2xl p-4 lg:p-8 border-5"
          style={{
            backgroundColor: "rgba(243, 243, 243, 1)",
            borderColor: "#A7CBF0",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
