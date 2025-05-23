"use client";
import Main from "@/components/General/Layout/Main";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BrandSettingsPage() {
  // const router = useRouter();
  const [appronEnabled, setAppronEnabled] = useState(false);
  const [level, setLevel] = useState("low");

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-black"
            >
              <span
                className="material-symbols-outlined mr-5"
                style={{ fontSize: "32px" }}
              >
                arrow_back
              </span>
            </button>
            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Settings Camera
              </h1>
              <nav
                className="text-sm text-gray-500 mt-1"
                aria-label="breadcrumb"
              >
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link href="/brand" className="hover:underline">
                      Brand
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">Live View</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              Wednesday
            </span>
            <p className="text-md font-medium text-black mt-4">
              10:00 AM, 04 April 2025
            </p>
          </div>
        </div>
        <div
          className="p-6 mb-4"
          style={{ background: "rgba(219, 231, 254, 1)" }}
        >
          <h1 className="text-2xl font-medium">Uniform</h1>
        </div>
        <div className="p-6 bg-gray-50 mb-4">
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Appron</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Level
            </label>
            <div className="flex gap-4">
              {["low", "med", "high"].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="level"
                    value={option}
                    checked={level === option}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mb-8 rounded-lg">
            <span className="text-gray-700 font-medium">Hat</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-8 rounded-lg">
            <span className="text-gray-700 font-medium">Mask</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
        </div>
        <div
          className="p-6 mb-4"
          style={{ background: "rgba(219, 231, 254, 1)" }}
        >
          <h1 className="text-2xl font-medium">Grooming</h1>
        </div>
        <div className="p-6 bg-gray-50 mb-4">
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Grooming</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
        </div>
        <div
          className="p-6 mb-4"
          style={{ background: "rgba(219, 231, 254, 1)" }}
        >
          <h1 className="text-2xl font-medium">Behavior</h1>
        </div>
        <div className="p-6 bg-gray-50 mb-4">
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Eat</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Drink</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Smoking</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
        </div>
        <div
          className="p-6 mb-4"
          style={{ background: "rgba(219, 231, 254, 1)" }}
        >
          <h1 className="text-2xl font-medium">Others</h1>
        </div>
        <div className="p-6 bg-gray-50 mb-4">
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Harrasment</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Fraud</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Using Handphone</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Idle</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Smoke</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mb-4 rounded-lg">
            <span className="text-gray-700 font-medium">Fire</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={appronEnabled}
                onChange={() => setAppronEnabled(!appronEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
              <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
                  appronEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </label>
          </div>
        </div>
      </Main>
    </div>
  );
}
