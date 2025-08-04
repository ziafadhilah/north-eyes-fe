"use client";

import Main from "@/components/General/Layout/Main";
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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const payload = { rules };
      const response = await editSettingsCamera(payload, token, cameraId);

      if (response.data.status === "success") {
        toastr.success("Settings updated successfully.");
        setTimeout(() => {
          setLoading(false);
          location.reload();
        }, 1500);
      } else {
        toastr.error("Failed to update settings.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toastr.error("Failed to update settings.");
      setLoading(false);
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-3 w-full gap-4 p-2">
        <div className="flex items-center gap-3 flex-wrap max-w-full">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-black hover:scale-110"
          >
            <span className="material-symbols-outlined mr-5 text-3xl">
              arrow_back
            </span>
          </button>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-title-color mb-2">
              Live Preview
            </h1>
            <nav
              className="hidden lg:block text-sm text-gray-500 mt-1"
              aria-label="breadcrumb"
            >
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 max-w-full">
                <li>Brand</li>
                <span className="material-symbols-outlined">chevron_right</span>
                <li>{brand_name}</li>
                <span className="material-symbols-outlined">chevron_right</span>
                <li>{outlet_name}</li>
                <span className="material-symbols-outlined">chevron_right</span>
                <li className="text-gray-700 font-medium">{area_name}</li>
                <span className="material-symbols-outlined">chevron_right</span>
                <li className="text-gray-700 font-medium">{camera_name}</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="text-left md:text-right">
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
          disabled={loading}
          className={`text-white px-4 py-2 rounded-2xl transition duration-300 ${
            loading ? "cursor-not-allowed opacity-70" : "hover:bg-[#2e5de3]"
          }`}
          style={{
            background:
              "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
          }}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </Main>
  );
}
