// Refactor semua kategori Settings menjadi komponen reusable agar rapi dan efisien

"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Reusable toggle + level switch
export const SettingToggle = ({
  label,
  name,
}: {
  label: string;
  name: string;
}) => {
  const [enabled, setEnabled] = useState(false);
  const [level, setLevel] = useState("low");

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-700 font-medium">{label}</span>
        <label className="inline-flex items-center cursor-pointer relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-all"></div>
          <motion.div
            animate={{ x: enabled ? 20 : 2 }}
            className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5"
          />
        </label>
      </div>
      <AnimatePresence>
        {enabled && (
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
                      name={name}
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
    </div>
  );
};
