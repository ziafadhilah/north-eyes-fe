"use client";

import Main from "@/components/General/Layout/Main";
import Link from "next/link";
import Accordion from "@/components/General/Accordion/Accordion";
import { SettingToggle } from "@/components/General/Accordion/SettingsAccordion";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  editSettingsCamera,
  fetchSettingsCameraByCameraId,
} from "@/service/camera/cameraService";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const UNIFORM = ["Appron", "Hat", "Mask"];
const GROOMING = ["Grooming"];
const BEHAVIOR = ["Eat", "Drink", "Smoking"];
const OTHERS = [
  "Harrasment",
  "Fraud",
  "Using Handphone",
  "Idle",
  "Smoke",
  "Fire",
];

const getCategory = (label: string): string => {
  const normalized = label.toLowerCase();
  if (UNIFORM.map((i) => i.toLowerCase()).includes(normalized))
    return "uniform";
  if (GROOMING.map((i) => i.toLowerCase()).includes(normalized))
    return "grooming";
  if (BEHAVIOR.map((i) => i.toLowerCase()).includes(normalized))
    return "behavior";
  return "others";
};

export default function BrandSettingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cameraId = params?.id as string;
  const [rules, setRules] = useState<
    {
      type: string;
      category: string;
      level: number;
      active: "on" | "off";
    }[]
  >([]);

  const brand_name = searchParams.get("brand_name") as string;
  const outlet_name = searchParams.get("outlet_name") as string;
  const area_name = searchParams.get("area_name") as string;
  const camera_name = searchParams.get("camera_name") as string;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && cameraId) {
      fetchSettingsCameraByCameraId(token, cameraId)
        .then((res) => {
          const rulesData = res.data?.data?.rules || [];
          setRules(rulesData);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          toastr.error("Error while fetching data");
        });
    }
  }, [cameraId]);

  const handleChange = (data: {
    active: "on" | "off";
    type: string;
    level: number;
  }) => {
    const updated = {
      ...data,
      category: getCategory(data.type),
    };

    setRules((prev) => [...prev.filter((r) => r.type !== data.type), updated]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toastr.error("Your session has expired. Please login again.");
      return;
    }

    try {
      const payload = { rules };
      await editSettingsCamera(payload, token, cameraId);
      toastr.success("Settings updated successfully.");
    } catch (error) {
      console.error(error);
      toastr.error("Failed to update settings.");
    }
  };

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const renderSection = (title: string, items: string[]) => (
    <Accordion title={title}>
      <div className="p-6 bg-gray-50">
        {items.map((label) => {
          const key = label.toLowerCase().replace(/\s+/g, "_");
          const matched = rules.find((r) => r.type === key);

          return (
            <SettingToggle
              key={label}
              label={label}
              name={`${key}-level`}
              defaultLevel={matched?.level}
              defaultActive={matched?.active === "on"}
              onChange={handleChange}
            />
          );
        })}
      </div>
    </Accordion>
  );

  return (
    <Main>
      <div className="flex items-start justify-between mb-3 w-full">
        <div className="flex items-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-black hover:scale-110"
          >
            <span className="material-symbols-outlined mr-5 text-3xl">
              arrow_back
            </span>
          </button>

          <div className="mb-3">
            <h1 className="text-3xl font-bold text-title-color mb-2">
              Live Preview
            </h1>
            <nav className="text-sm text-gray-500 mt-1" aria-label="breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/brand" className="hover:underline">
                    Brand
                  </Link>
                </li>
                <span className="material-symbols-outlined">chevron_right</span>
                <li>{brand_name}</li>
                <span className="material-symbols-outlined">chevron_right</span>
                <Link
                  href="#"
                  onClick={() => window.history.back()}
                  className="hover:underline"
                >
                  {outlet_name}
                </Link>
                <span className="material-symbols-outlined">chevron_right</span>
                <li className="text-gray-700 font-medium">{area_name}</li>
                <span className="material-symbols-outlined">chevron_right</span>
                <li className="text-gray-700 font-medium">{camera_name}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="text-right">
          <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
            {dayName}
          </span>
          <p className="text-md font-medium text-black mt-4">
            {dateTimeString}
          </p>
        </div>
      </div>

      {renderSection("Uniform", UNIFORM)}
      {renderSection("Grooming", GROOMING)}
      {renderSection("Behavior", BEHAVIOR)}
      {renderSection("Others", OTHERS)}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Submit Settings
        </button>
      </div>
    </Main>
  );
}
