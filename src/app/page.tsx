/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-gray-100 via-blue-100 to-gray-200 animate-softFade text-gray-800">
      {/* Soft Glow Layer */}
      <div className="absolute w-full h-full bg-very-soft-glow opacity-20 pointer-events-none"></div>

      <div
        className={`w-80 h-80 rounded-3xl shadow-xl backdrop-blur-lg bg-white/50 flex flex-col items-center justify-center transform transition-all duration-700 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h1 className="text-3xl font-bold text-blue-500 mb-2 tracking-wide animate-pulse">
          Welcome
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Preparing your experience...
        </p>

        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-blue-400/60 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-blue-300/30 border-t-transparent rounded-full animate-slow-spin"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full shadow-md animate-ping"></div>
        </div>
      </div>
    </div>
  );
}
