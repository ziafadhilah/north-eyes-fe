/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SettingToggleProps {
  label: string;
  name: string;
  onChange: (payload: {
    type: string;
    level: number;
    category: string;
    active: "on" | "off";
  }) => void;
  defaultLevel?: number;
  defaultActive?: boolean;
}

export const SettingToggle = ({
  label,
  name,
  onChange,
  defaultLevel = 3,
  defaultActive = false,
}: SettingToggleProps) => {
  const [enabled, setEnabled] = useState(defaultActive ?? false);
  const [level, setLevel] = useState<number>(defaultLevel ?? 3);

  useEffect(() => {
    onChange({
      type: label.toLowerCase().replace(/\s+/g, "_"),
      category: getCategory(label),
      level: level,
      active: enabled ? "on" : "off",
    });
  }, [enabled, level, label]);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">{label}</span>
        <label className="inline-flex items-center cursor-pointer relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={() => setEnabled(!enabled)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-all" />
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
            className="overflow-hidden pl-4"
          >
            <label className="block text-gray-700 font-medium mb-2">
              Select Level
            </label>
            <div className="flex gap-4">
              {[3, 2, 1].map((val, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={name}
                    value={val}
                    checked={level === val}
                    onChange={() => setLevel(val)}
                  />
                  <span className="capitalize">
                    {["low", "med", "high"][index]}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Determine category from label
const getCategory = (label: string): string => {
  const lower = label.toLowerCase();
  if (["appron", "hat", "mask"].includes(lower)) return "uniform";
  if (lower === "grooming") return "grooming";
  if (["eat", "drink", "smoking"].includes(lower)) return "behavior";
  return "others";
};
