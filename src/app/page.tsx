"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800 transition-all duration-500">
      <div className="bg-white px-10 py-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-blue-600">Welcome!</h1>
        <p className="mt-4 text-lg">Redirecting...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
