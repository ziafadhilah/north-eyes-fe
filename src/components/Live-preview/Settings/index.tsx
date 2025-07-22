"use client";
import Main from "@/components/General/Layout/Main";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import Accordion from "@/components/General/Accordion/Accordion";
import { motion, AnimatePresence } from "framer-motion";

export default function BrandSettingsPage() {
  const [appronEnabled, setAppronEnabled] = useState(false);
  const [hatEnabled, setHatEnabled] = useState(false);
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
        <Accordion title="Uniform">
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-medium">Appron</span>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={appronEnabled}
                  onChange={() => setAppronEnabled(!appronEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-all"></div>
                <motion.div
                  animate={{ x: appronEnabled ? 20 : 2 }}
                  className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5"
                />
              </label>
            </div>
            <AnimatePresence>
              {appronEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4">
                    <label className="block text-gray-700 font-medium">
                      Select Level
                    </label>
                    <div className="flex gap-4">
                      {["low", "med", "high"].map((option) => (
                        <label key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="appron-level"
                            value={option}
                            checked={level === option}
                            onChange={(e) => setLevel(e.target.value)}
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Hat</span>
              <label className="inline-flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hatEnabled}
                  onChange={() => setHatEnabled(!hatEnabled)}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-all"></div>
                <motion.div
                  animate={{ x: hatEnabled ? 20 : 2 }}
                  className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5"
                />
              </label>
            </div>
            <AnimatePresence>
              {hatEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="ml-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Select Level
                    </label>
                    <div className="flex gap-4">
                      {["low", "med", "high"].map((option) => (
                        <label key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="appron-level"
                            value={option}
                            checked={level === option}
                            onChange={(e) => setLevel(e.target.value)}
                          />
                          <span className="capitalize">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
        </Accordion>
        <Accordion title="Grooming">
          <div className="p-6 bg-gray-50">
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
        </Accordion>
        <Accordion title="Behavior">
          <div className="p-6 bg-gray-50">
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
        </Accordion>
        <Accordion title="Others">
          <div className="p-6 bg-gray-50">
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
        </Accordion>
      </Main>
    </div>
  );
}
