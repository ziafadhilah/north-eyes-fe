/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const handleLogin = () => {
    router.push("/home");
  };
  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url("/static/images/bg_login.jpg")',
        backgroundSize: "center",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom right, #DBE7FE 0%, rgba(89, 34, 171, 0.72) 100%)",
        }}
      ></div>
      <div className="z-10 flex flex-col items-center">
        <div
          className="p-8 rounded-2xl w-130 text-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0px -10px 0px rgba(156, 201, 251, 1)",
          }}
        >
          <div className="flex items-center justify-center mb-8">
            <span className="text-xl font-bold text-gray-800 mr-2">
              Powered By
            </span>
            <img
              src="/static/images/idea_logo.png"
              alt="Idea Logo"
              className="h-5"
            />
          </div>
          <h1
            className="text-sm font-bold"
            style={{ color: "rgba(3, 85, 247, 1)" }}
          >
            Sign in to account
          </h1>
          <h1 className="text-gray-400 text-sm mb-7">
            Please insert your login details to login
          </h1>
          <p className="text-gray-700 text-start">User Name :</p>
          <input
            type="text"
            placeholder="Enter your username here"
            className="mt-2 p-2 text-gray-400 border border-gray-300 rounded-xl w-full bg-white mb-7"
          />
          <p className="text-gray-700 text-start">Your Password :</p>
          <input
            type="password"
            placeholder="Enter your password here"
            className="mt-2 p-2 text-gray-400 border border-gray-300 rounded-xl w-full bg-white mb-4"
          />
          <p className="mt-4 text-sm text-gray-400 mb-4">
            Forgot your password?{" "}
            <a href="/register" style={{ color: "rgba(240, 0, 0, 1)" }}>
              Reset password
            </a>
          </p>
          <button
            onClick={() => handleLogin()}
            type="button"
            className="mt-4 p-2 text-white rounded-md w-full"
            style={{ backgroundColor: "rgba(3, 85, 247, 1)" }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
