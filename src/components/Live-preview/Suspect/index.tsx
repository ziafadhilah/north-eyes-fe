/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import Main from "@/components/General/Layout/Main";
import {
  EditViolationDataList,
  ViolationDataList,
} from "@/constants/violationData";
import {
  getViolationList,
  updateViolationList,
} from "@/service/camera/violationService";
import Link from "next/link";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function SuspectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const id = params?.id;
  const brand_name = searchParams.get("brand_name") as string;
  const outlet_name = searchParams.get("outlet_name") as string;
  const outlet_id = searchParams.get("outlet_id") as string;
  const area_name = searchParams.get("area_name") as string;
  const area_id = searchParams.get("area_id") as string;
  const is_confirmed = searchParams.get("is_confirmed") as string;
  const [autoValid, setAutoValid] = useState(false);

  const [violation, setViolation] = useState<ViolationDataList[]>([]);

  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateTimeString = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const getViolationData = async () => {
    const token = localStorage.getItem("token");
    const company_id = localStorage.getItem("company_id");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!company_id) {
      toastr.error("Company information missing. Please login again.");
      return;
    }

    try {
      const res = await getViolationList(
        token,
        company_id,
        outlet_id,
        is_confirmed
      );

      const allData: ViolationDataList[] = res?.data?.data?.data ?? [];

      if (res?.status === 200 && Array.isArray(allData)) {
        setViolation(allData);
        // set autoValid if every item is_valid === true
        const allValid =
          allData.length > 0 && allData.every((it) => !!it.is_valid);
        setAutoValid(allValid);
      } else {
        toastr.error("Violation data not found or invalid response");
      }
    } catch (error) {
      console.error("getViolationData error:", error);
      toastr.error("Failed to load violation data");
    }
  };

  const updateViolationAt = (
    index: number,
    patch: Partial<ViolationDataList>
  ) => {
    setViolation((prev) => {
      const next = prev.map((v, i) => (i === index ? { ...v, ...patch } : v));
      const allValid = next.length > 0 && next.every((it) => !!it.is_valid);
      setAutoValid(allValid);
      return next;
    });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!violation || violation.length === 0) {
      toastr.info("No changes to submit");
      return;
    }

    try {
      const payload: EditViolationDataList[] = violation.map((v) => ({
        violation_id: v.violation_id,
        is_valid: !!v.is_valid,
        note: v.note ?? "",
        is_confirmed: !!v.is_confirmed,
        // include level (normalize to integer, default to 1)
        level: typeof v.level === "number" ? v.level : Number(v.level) || 1,
      }));

      const res = await updateViolationList(token, payload);

      if (res?.status === 200) {
        toastr.success("All changes submitted successfully");
        await getViolationData();
      } else {
        console.error("updateViolationList response:", res);
        toastr.error("Failed to submit changes");
      }
    } catch (error) {
      console.error("handleSubmit error:", error);
      toastr.error("Failed to submit changes");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const companyId = localStorage.getItem("company_id");

    if (!token) {
      router.push("/login");
      return;
    }

    if (companyId && id) {
      getViolationData();
    } else if (!companyId) {
      toastr.error("Company information missing");
    }
  }, [id, outlet_id, is_confirmed]);

  return (
    <div>
      <Main>
        <div className="flex items-start justify-between mb-3 w-full">
          <div className="flex items-center">
            <Link
              href={{
                pathname: `/brand/live-preview/${area_id}`,
                query: {
                  brand_name,
                  outlet_name,
                  outlet_id,
                  area_name,
                },
              }}
            >
              <span
                className="material-symbols-outlined mr-5"
                style={{ fontSize: "32px" }}
              >
                arrow_back
              </span>
            </Link>

            <div className="mb-3">
              <h1 className="text-3xl font-bold text-title-color mb-2">
                Violation
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
                  <li>
                    <Link href="/brand" className="hover:underline">
                      {brand_name}
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li>
                    <Link href="/brand" className="hover:underline">
                      {outlet_name}
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li>
                    <Link
                      href={`/brand/live-preview/${id}`}
                      className="hover:underline"
                    >
                      {area_name}
                    </Link>
                  </li>
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                  <li className="text-gray-700 font-medium">Suspect</li>
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

        <div className="flex items-start justify-between mb-3 w-full">
          <h1 className="text-2xl font-bold mb-4">
            Suspect{" "}
            <span className="text-white text-sm me-2 text-center font-medium px-2.5 py-1 rounded-md ne-accent">
              {violation.length}
            </span>
          </h1>

          <div className="text-right">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="accent-blue-600 w-6 h-6"
                checked={autoValid}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setAutoValid(checked);
                  setViolation((prev) =>
                    prev.map((v) => ({ ...v, is_valid: checked }))
                  );
                }}
              />
              <h1 className="text-black text-md">Auto Valid</h1>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
          {violation?.map((item, index) => (
            <div
              key={item.violation_id ?? index}
              className="rounded-lg shadow-md p-4 bg-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">
                  {item.type}{" "}
                  <span className="text-yellow-600">Case #{index + 101}</span>
                </h2>
                <input
                  type="checkbox"
                  className="accent-green-600 w-5 h-5"
                  checked={item.is_confirmed ?? false}
                  onChange={(e) =>
                    updateViolationAt(index, { is_confirmed: e.target.checked })
                  }
                />
              </div>

              {(() => {
                const t = (item.type || "").toString().trim().toUpperCase();
                const videoUrl = item.video ? item.video.toString().trim() : "";
                const imageUrl = item.image ? item.image.toString().trim() : "";

                if (t === "AD" && videoUrl) {
                  return (
                    <video
                      className="w-full h-60 object-cover rounded-md mb-3"
                      controls
                      preload="metadata"
                      poster={imageUrl || "/static/images/bg_login.png"}
                    >
                      <source src={videoUrl} />
                      Your browser does not support the video tag.
                    </video>
                  );
                }

                // default to image (for OD or other types)
                return (
                  <img
                    src={imageUrl || "/static/images/bg_login.png"}
                    alt="Violation"
                    className="w-full h-60 object-cover rounded-md mb-3"
                  />
                );
              })()}

              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Violation</span>
                <span className="font-semibold">Supervisor</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <p className="text-red-600">{item.detected}</p>
                <div className="flex gap-2">
                  <button
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      item.is_valid ? "bg-false" : "bg-true"
                    }`}
                    onClick={() => updateViolationAt(index, { is_valid: true })}
                  >
                    Valid
                  </button>

                  <button
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      item.is_valid === false ? "bg-false" : "bg-true"
                    }`}
                    onClick={() =>
                      updateViolationAt(index, { is_valid: false })
                    }
                  >
                    Invalid
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">Date/Time</span>
                <span className="font-semibold">Type</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span>
                  {(() => {
                    const created = item.created_at
                      ? new Date(item.created_at)
                      : null;
                    return created && !isNaN(created.getTime())
                      ? created.toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "-";
                  })()}
                </span>
                <div className="flex gap-1 text-xs justify-content-end">
                  <button
                    type="button"
                    onClick={() =>
                      setViolation((prev) =>
                        prev.map((v, i) =>
                          i !== index ? v : { ...v, level: 1 }
                        )
                      )
                    }
                    className={`px-2 py-1 rounded ${
                      item.level === 1 ? "bg-false" : "bg-true"
                    }`}
                  >
                    Low
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setViolation((prev) =>
                        prev.map((v, i) =>
                          i !== index ? v : { ...v, level: 2 }
                        )
                      )
                    }
                    className={`px-2 py-1 rounded ${
                      item.level === 2 ? "bg-false" : "bg-true"
                    }`}
                  >
                    Med
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setViolation((prev) =>
                        prev.map((v, i) =>
                          i !== index ? v : { ...v, level: 3 }
                        )
                      )
                    }
                    className={`px-2 py-1 rounded ${
                      item.level === 3 ? "bg-false" : "bg-true"
                    }`}
                  >
                    High
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Area:</span> {area_name}
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note:
                </label>
                <input
                  type="text"
                  value={item.note || ""}
                  placeholder="Add Note"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateViolationAt(index, { note: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="text-right mt-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
            style={{
              background:
                "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
            }}
          >
            Submit
          </button>
        </div>
      </Main>
    </div>
  );
}
