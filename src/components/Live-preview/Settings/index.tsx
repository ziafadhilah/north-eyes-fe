"use client";
import Main from "@/components/General/Layout/Main";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import Accordion from "@/components/General/Accordion/Accordion";
import { SettingToggle } from "@/components/General/Accordion/SettingsAccordion";

export default function BrandSettingsPage() {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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

          <div className="text-left md:text-right p-3">
            <span className="text-white text-md font-medium px-2.5 py-0.5 rounded-md ne-accent">
              {dayName}
            </span>
            <p className="text-md font-medium text-black mt-4">
              {dateTimeString}
            </p>
          </div>
        </div>
        <Accordion title="Uniform">
          <div className="p-6 bg-gray-50">
            <SettingToggle label="Appron" name="appron-level" />
            <SettingToggle label="Hat" name="hat-level" />
            <SettingToggle label="Mask" name="mask-level" />
          </div>
        </Accordion>

        <Accordion title="Grooming">
          <div className="p-6 bg-gray-50">
            <SettingToggle label="Grooming" name="grooming-level" />
          </div>
        </Accordion>

        <Accordion title="Behavior">
          <div className="p-6 bg-gray-50">
            <SettingToggle label="Eat" name="eat-level" />
            <SettingToggle label="Drink" name="drink-level" />
            <SettingToggle label="Smoking" name="smoking-level" />
          </div>
        </Accordion>

        <Accordion title="Others">
          <div className="p-6 bg-gray-50">
            <SettingToggle label="Harrasment" name="harrasment-level" />
            <SettingToggle label="Fraud" name="fraud-level" />
            <SettingToggle label="Using Handphone" name="handphone-level" />
            <SettingToggle label="Idle" name="idle-level" />
            <SettingToggle label="Smoke" name="smoke-level" />
            <SettingToggle label="Fire" name="fire-level" />
          </div>
        </Accordion>
      </Main>
    </div>
  );
}
